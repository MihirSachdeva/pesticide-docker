from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    To not perform the csrf check previously happening.
    """

    def enforce_csrf(self, request):
        return
