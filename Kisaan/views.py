from django.shortcuts import render, redirect
from django.http import JsonResponse, request, HttpResponse
from .models import RegisterUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import get_user_model
from django.db import models, transaction, connection
from django.contrib.auth import login as auth_login 
# Create your views here.

def index(request):
    if request.user.is_authenticated:
        target_url = '/dashboard/'  # or reverse('dashboard')
    else:
        target_url = '/login/'

    return render(request, "index.html", {'target_url':target_url})


def login(request):
    if not request.user.is_authenticated:
        if request.method == "POST":
            mobile = request.POST.get('mobile')
            request.session['mobile_number'] = mobile
            user_name = mobile+"@medikiosk.com"
            userModel = get_user_model()
            isUser = userModel.objects.filter(username = user_name).exists()
            isUserRegistered = RegisterUser.objects.filter(user_phone_number = mobile).exists()
            if isUser and isUserRegistered:
                username = user_name
                password = RegisterUser.objects.filter(user_phone_number = mobile).first().user_password  # Get the password of the existing user
                userlog = authenticate(request, username=username, password=password)
                print(password)
                print(userlog)
                with transaction.atomic():
                    auth_login(request, userlog)
                    return redirect('dashboard')
            else:
                return redirect(signup)
    else:
        return redirect('dashboard')
    return render(request, 'login.html')

def signup(request):
    return render(request, 'signup.html')