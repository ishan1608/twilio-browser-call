from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from twilio.jwt.client import ClientCapabilityToken
from twilio.twiml.voice_response import VoiceResponse


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


@method_decorator(csrf_exempt, name='dispatch')
class VoiceRequestView(View):
    def post(self, request, **kwargs):
        """Returns TwiML instructions to Twilio's POST requests"""
        response = VoiceResponse()
        response.say('Calling {}'.format(request.POST['phoneNumber']), voice='alice')
        response.dial(caller_id=settings.TWILIO['TWILIO_NUMBER'], number=request.POST['phoneNumber'])
        return HttpResponse(str(response))
