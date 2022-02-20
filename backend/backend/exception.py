from rest_framework.views import exception_handler


# https://www.django-rest-framework.org/api-guide/exceptions/
def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None and 'detail' in response.data:
        response.data['result'] = False
        response.data['message'] = ' '.join([str(response.status_code), response.data['detail']])
        del response.data['detail']

    return response
