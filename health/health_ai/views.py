from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from .models import Message


def index(request):
    return render(request, 'index.html')

def chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            message = data.get('message')

            if message:
                Message.objects.create(content=message)
                return JsonResponse('Mensagem recebida com sucesso!', status=200)
            else:
                return JsonResponse('Mensagem vazia', status=400)
        except json.JSONDecodeError:
            return JsonResponse('Erro ao decodificar JSON', status=400)
    return render(request, 'index.html')

# Create your views here.
