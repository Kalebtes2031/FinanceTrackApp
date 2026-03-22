import logging
from rest_framework.views import exception_handler

logger = logging.getLogger('django.request')


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        view = context.get('view')
        logger.exception('Unhandled exception in %s', view.__class__.__name__ if view else 'unknown view')

    return response
