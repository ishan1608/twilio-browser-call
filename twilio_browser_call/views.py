from django.conf import settings
from django.http import JsonResponse
from django.views.generic import View
from twilio.jwt.client import ClientCapabilityToken


class GetTokenView(View):
    def get(self, request):
        """Returns a Twilio Client token"""
        # Create a TwilioCapability token with our Twilio API credentials
        capability = ClientCapabilityToken(
            settings.TWILIO['ACCOUNT_SID'],
            settings.TWILIO['AUTH_TOKEN']
        )

        # Allow our users to make outgoing calls with Twilio Client
        capability.allow_client_outgoing(settings.TWILIO['TWIML_APPLICATION_SID'])

        # Generate the capability token
        # token = capability.generate()
        token = capability.to_jwt().decode('utf-8')

        return JsonResponse({'token': token})


class VoiceRequestView(View):
    def post(self, request, **kwargs):
        print(request.POST)
        print(kwargs)
