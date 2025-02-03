from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request, 'index.html')

def chat(request):
    pass

# Create your views here.
