from django.db import models
from django.db import models
from django.core.exceptions import ValidationError
from pathlib import Path
from django.contrib.auth.models import User
from django.conf import settings
import uuid

# Create your models here.
class RegisterUser(models.Model):
    user_email = models.EmailField(unique=True)
    user_name = models.CharField(max_length=122, null=True)
    user_phone_number = models.CharField(max_length=122, null=True, unique=True)
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user_password = models.CharField(max_length=122, null=True)

    # user_city = models.CharField(max_length=122, null=True)
    # user_address1 = models.TextField( null=True)
    # user_state = models.CharField(max_length=122, null=True)
    # user_zip_code = models.IntegerField(null=True)
    # user_ip_country = models.CharField(max_length=122, null=True)
    
    
    account_creation_date = models.DateTimeField(auto_now_add=True, null=True)
    user_ip = models.CharField(max_length=122, null=True)
    #user_ip_info = models.TextField(null=True)
    last_login = models.DateTimeField(null=True, blank=True)  # To track active users
    is_blocked = models.BooleanField(default=False)           # To track blocked users

    def __str__(self):
        return self.user_email