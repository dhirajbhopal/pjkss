from django.db import models
import os
import datetime
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, AbstractBaseUser
from django.db import models
#from import_export import resources


# Create your models here.


def filepathadmin(req,filename):
   old_filename = filename
   timeNow = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
   filename= "%s%s" % (timeNow,old_filename)
   return os.path.join('uploads/',filename)
  


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)

        user.set_password(password)

        user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser has to have is_staff being True")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser has to have is_superuser being True")

        return self.create_user(email=email, password=password, **extra_fields)



class User(AbstractUser):
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    image=models.ImageField(upload_to=filepathadmin,null=True,blank=True,default='static/images/cybromlogo.webp')
    role=models.CharField(max_length=15,null=True,blank=True)
    mobileno=models.CharField(max_length=15,null=True,blank=True)
    gender=models.CharField(max_length=15,null=True,blank=True)
    rollno=models.CharField(max_length=20,null=False,blank=True,unique=True)
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username


class studentdetails(models.Model):
    email=models.EmailField(unique=True)
    name=models.CharField(max_length=50)
    lastname=models.CharField(max_length=50)
    fathername=models.CharField(max_length=30,blank=True)
    fatherlastname=models.CharField(max_length=30,blank=True)
    mobileno=models.CharField(max_length=15,blank=True)
    gender=models.CharField(max_length=10,blank=True,null=True)
    dob=models.DateField(blank=True,null=True)
    doa=models.DateField(blank=True,null=True)
    address=models.CharField(max_length=200,blank=True)
    rollno=models.CharField(max_length=20,null=False,blank=True,unique=True)

    def __str__(self):
        return self.email
                 
class studentmarks(models.Model):
    rollno=models.CharField(max_length=20)
    branch=models.CharField(max_length=40)
    semester=models.CharField(max_length=15)
    subject1=models.CharField(max_length=100)
    subjectcode1=models.CharField(max_length=30)
    marks1=models.CharField(max_length=30)
    prac1=models.CharField(max_length=30)
    subject2=models.CharField(max_length=100)
    subjectcode2=models.CharField(max_length=30)
    marks2=models.CharField(max_length=30)
    prac2=models.CharField(max_length=30)
    subject3=models.CharField(max_length=100)
    subjectcode3=models.CharField(max_length=30)
    marks3=models.CharField(max_length=30)
    prac3=models.CharField(max_length=30)
    subject4=models.CharField(max_length=100)
    subjectcode4=models.CharField(max_length=30)
    marks4=models.CharField(max_length=30)
    prac4=models.CharField(max_length=30)
    subject5=models.CharField(max_length=100)
    subjectcode5=models.CharField(max_length=30)
    marks5=models.CharField(max_length=30)
    prac5=models.CharField(max_length=30)
    school=models.CharField(max_length=200)
    resultdate=models.DateField()
    status=models.CharField(max_length=30)
    sessionyear=models.CharField(max_length=30)
    def __str__(self):
        return self.rollno

class studentfee(models.Model):
    rollno=models.CharField(max_length=20,unique=False)
    month=models.CharField(max_length=20,unique=False)
    pendingamount=models.CharField(max_length=20)
    paidamount=models.CharField(max_length=20)
    latefine=models.CharField(max_length=20)
    paiddate=models.DateField()
    sessionyear=models.CharField(max_length=30)


    def __str__(self):
        return self.rollno
