from django.shortcuts import render
from django.http import HttpResponse
from django import forms


def index(request):
    return render(request, 'index.html')

def chat(request):
    if request.method == "POST":
        userInput = request.POST.get('novaMensagem')
        return render(request, 'index.html', {'novaMensagem': userInput})
    return render(request, 'index.html')

# Create your views here.
