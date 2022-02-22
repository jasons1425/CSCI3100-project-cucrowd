from rest_framework.views import exception_handler


# https://www.django-rest-framework.org/api-guide/exceptions/
def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data['result'] = False  # ensure boolean data type
        if 'detail' in response.data:
            response.data['message'] = ' '.join([str(response.status_code), response.data['detail']])
            del response.data['detail']

    return response
