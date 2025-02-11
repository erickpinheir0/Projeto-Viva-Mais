from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Message
from .bot import AI_Bot


def index(request):
    return render(request, 'index.html')

@csrf_exempt
def chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            message = data.get('message')
            ai_bot = AI_Bot()

            response = ai_bot.invoke(question=message)

            if message:
                Message.objects.create(content=message)
                return JsonResponse(response, safe=False, status=200)
            else:
                return JsonResponse('Mensagem vazia', safe=False, status=400)
        except json.JSONDecodeError:
            return JsonResponse('Erro ao decodificar JSON', safe=False, status=400)
    return render(request, 'index.html')

# Create your views here.
