from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Message
from .bot import AI_Bot

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def post(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            message = data.get('message')
            
            if message and message.strip():
                ai_bot = AI_Bot()  
                print("Mensagem recebida:", message)
                resposta = ai_bot.invoke(question=message)
                print("Resposta da IA:", resposta)
    
                # Salva a mensagem do usuário e a resposta da IA
                Message.objects.create(content=message)
                Message.objects.create(content=resposta)
                
                # Retorna a resposta diretamente
                return JsonResponse({'response': resposta}, safe=False, status=200)
            else:
                return JsonResponse({'error': 'Mensagem vazia'}, safe=False, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Erro ao decodificar JSON'}, safe=False, status=400)
    return render(request, 'index.html')

def get(request):
    if request.method == "GET":
        mensagens = Message.objects.all().order_by('-criado_em').values()  # converte para QuerySet de dicionários
        return JsonResponse(list(mensagens), safe=False, status=200)
    return render(request, 'index.html')