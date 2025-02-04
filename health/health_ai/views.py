from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request, 'index.html')
    


def chat(request):

    if request.method == "POST":
        valor_input = request.POST.get('userInput')
        print("Valor Recebido", valor_input)
        return print("Enviou")

# Create your views here.
