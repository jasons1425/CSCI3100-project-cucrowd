import datetime
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from .serializers import ExperimentSerializer, EnrollmentSerializer
from .models import Experiment, Enrollment
from backend.settings import EMAIL_HOST_USER
from django.core.mail import send_mail


# experiment view class responsible for the Experiment feature
# permission control based on the action taken
# ref: https://stackoverflow.com/a/35987077/16418649
class ExperimentView(viewsets.ModelViewSet):
    serializer_class = ExperimentSerializer
    queryset = Experiment.objects.all().order_by('-post_date')
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'destroy': [IsAuthenticated],
        'update': [IsAuthenticated],
        'partial_update': [IsAuthenticated],
    }

    # permission control of each endpoint
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    # endpoint responsible for experiment creation
    # referencing the method from the below website
    # https://ilovedjango.com/django/rest-api-framework/tips/save-foreign-key-using-django-rest-framework-create-method/
    # if the "host" field info is passed to the serializer via the data argument,
    #    that field will disappear when reaching the serializer.create() method due to unknown reasons
    def create(self, request, *args, **kwargs):
        host = request.user
        # check user role
        if host.is_org is False:
            raise ValidationError({"result": False, "message": "Only organization users can create experiments."})
        # remove "host" field in request payload to stop user from changing experiment host
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        _serializer = self.serializer_class(data=request.data, context={"host": host})
        if _serializer.is_valid(raise_exception=True):
            self.perform_create(_serializer)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # endpoint responsible for editing experiment
    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        # check user identity
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can update the content."})
        # remove "host" field in request payload to stop user from changing experiment host
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        return super().partial_update(request, *args, **kwargs)

    # endpoint responsible for deleting team
    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        # check user identity
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can destroy the content."})
        return super().destroy(request, *args, **kwargs)

    # endpoint responsible for updating team
    def update(self, request, *args, **kwargs):
        # treat all update as partial update (so that no need to attach all experiment fields info in the payload)
        kwargs['partial'] = True
        user = request.user
        instance = self.get_object()
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can edit the content."})
        # remove "host" field in request payload to stop user from changing experiment host
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        return super().update(request, *args, **kwargs)

    # endpoint responsible for retrieving enrolled participant list given an experiment
    @action(detail=True, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get enrolled participants')
    def enrolled(self, request, pk):
        user = request.user
        exp = self.get_queryset().filter(pk=pk)
        # check experiment
        if not exp:
            raise ValidationError({"result": False, "mesage": "Experiment not found."})
        exp = exp[0]
        # check user identity
        if exp.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can request participant info."})
        enrolled = exp.enrollment_set.all()
        serializer = EnrollmentSerializer(enrolled, many=True)
        return Response(serializer.data)

    # endpoint responsible for retrieving all ongoing experiments, i.e. deadline in the future
    @action(detail=False, methods=['GET'], permission_classes=[AllowAny],
            name='get ongoing experiments', url_path='ongoing')
    def ongoing(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(deadline__gte=datetime.date.today())
        # for pagination purpose
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# enroll view class responsible for experiment enrollment
class EnrollView(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    queryset = Enrollment.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [IsAdminUser],
        'retrieve': [IsAdminUser],
        'destroy': [IsAuthenticated],
        'update': [IsAdminUser],
        'partial_update': [IsAdminUser],
    }

    # permission control for each endpoint
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    # endpoint responsible for enrolling an experiment
    def create(self, request, *args, **kwargs):
        participant = request.user
        data = request.data
        exp_id = data.get('experiment', None)
        # check user role
        if participant.is_org:
            raise ValidationError({"result": False, "message": "Only student users can enroll in experiments."})
        # check payload integrity
        if exp_id is None:
            raise ValidationError({"result": False, "message": "Missing experiment ID."})
        try:
            exp_obj = Experiment.objects.filter(id=request.data['experiment'])
            # check experiment
            assert exp_obj.exists()
            exp_obj = exp_obj[0]
        except (FieldValidationError, AssertionError):
            raise ValidationError({"result": False, "message": "Experiment not found."})
        deadline = exp_obj.deadline
        # check experiment deadline
        if deadline < datetime.date.today():
            raise ValidationError({"result": False, "message": f"The experiment is closed on {deadline}."})
        existing_exp_records = self.get_queryset().filter(experiment=exp_obj, participant=participant)
        # check if user has already enrolled in the experiment
        if existing_exp_records.exists():
            raise ValidationError({"result": False, "message": "The current user already enrolled in the experiment"})
        _serializer = self.serializer_class(data=request.data,
                                            context={"participant": participant, "experiment": exp_obj})
        if _serializer.is_valid(raise_exception=False):
            self.perform_create(_serializer)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            err_dict = _serializer.errors
            err_msg = [str(err_dict[k][0]) for k in err_dict]
            raise ValidationError({"result": False, "message": '; '.join(err_msg)})

    # endpoint responsible for canceling an enrollment
    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        host = instance.experiment.host
        participant = instance.participant
        # check user identity
        if user.id != host.id and user.id != participant.id:
            raise ValidationError({"result": False,
                                   "message": "Only experiment host and participant can cancel the enrollment."})
        res = super().destroy(request, *args, **kwargs)
        exp_name = instance.experiment.title
        exp_time = instance.selected_time
        user_email = user.email
        send_mail(f"Experiment Enrollment Canceled",
                  f"Dear {user.username},\n\n"
                  f"Your enrollment of the below experiment is canceled.\n\n"
                  f"Title : {exp_name:<100}\n"
                  f"Time : {exp_time}\n\n"
                  f"Yours Sincerely,\nCUCrowd Project team",
                  EMAIL_HOST_USER,
                  [user_email],
                  fail_silently=False)
        return res
