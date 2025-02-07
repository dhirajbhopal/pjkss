from django.shortcuts import render, redirect, HttpResponse,HttpResponseRedirect
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView
from core.forms import SignUpForm, ProfileForm,ImgForm
from django.contrib.auth.models import User
from django.contrib import auth
from django.urls import reverse
from django.views import View
from core.models import User,studentdetails,studentmarks,studentfee
from django.conf import settings
from django.contrib import messages
from django.db.utils import IntegrityError
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from random import randint
import openpyxl
import pandas as pd
from django.conf import settings  
from tablib import Dataset
#from rest_framework import generics
#from import_export import resources
from django.core.files.storage import FileSystemStorage
from num2words import num2words
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout


class ProfileView(View):
    if User.is_authenticated:
        def get(self, request):
            form = ProfileForm(request.POST)
            return render(request,'commons/profile.html',{'form':form})

class ProfileUpdate(UpdateView):
    if User.is_authenticated:
        model = User
        form_class = ProfileForm
        success_url = reverse_lazy('home')
        template_name = 'commons/profile.html'

class Imageview(View):
    if User.is_authenticated:
        def get(self, request):
            form = ImgForm(request.POST)
            return render(request,'commons/imageupdate.html',{'form':form})

class showstu(View):
    if User.is_authenticated:
        def get(self, request):
            studetail=studentdetails.objects.all().exclude(name="")
            return render(request,'adminrole/studentinfo.html',{'studetail':studetail})

@login_required
def Imageupdate(req):
    try:
        email=req.POST.get("email")
        img2=User.objects.get(email=email)
        img2.image=req.FILES['image']
        img2.save()
        msg="Profile photo changed Successfully"
        return render(req,'base.html',{"msg":msg})
    except Exception as ex:       
        return redirect('/')

class mysingup(View):

    def get(self,request):
        try:
            return render(request,'commons/signup.html')
        except Exception as ex:
            msg="signup form not found"
            return render(request,'base.html',{'msg':msg})

class addstudent(View):

    def get(self,request):
        return render(request,'adminrole/addstudents.html')

class forgotpassword(View):

    def get(self,request):
        return render(request,'commons/forgotpass.html')

"""class signuptask(View):

    def get(self,request):
        code = 0
        try:
            encryptedpassword=make_password(request.GET['password'])
            ob=User()
            ob2=studentdetails()
            ob.username=request.GET.get("username")
            ob.mobileno=request.GET.get("mobileno")
            ob.email=request.GET.get("emailid")
            ob.first_name=request.GET.get("name")
            ob.last_name=request.GET.get("name1")
            ob.password=encryptedpassword
            ob.gender=request.GET.get("gender")
            ob2.email=request.GET.get("emailid")
            ob2.first_name=request.GET.get("name")
            ob2.last_name=request.GET.get("name1")
            ob.save()
            ob2.save()
        except IntegrityError as ex:          
            code = 1
            #return HttpResponse("Email id Already exist")
        except Exception as ex:       
            code = 2
            #return HttpResponse("Email id Not Found")
        return redirect("/cheksignup?err="+str(code))"""


def cheksignup(req):
    code = req.GET.get("err")
    msg = ""
    if code=="0":
        msg="Registeration Done Successfully"
        return redirect('login/',{"msg":msg})
    if code=="1":
        msg="Phone or Email is Already Registered !"        
    if code=="2":
        msg="Registeration Failed !"        
    return render(req,'commons/signup.html',{"msg":msg})  

def generateOTP(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return randint(range_start, range_end)


def sendmail(email,otp):
    try:
        print("mail iniitializing")
        message ="""<html><body><h1 style='color:red'>Welcome to Cybrom</h1> <hr>Hello Mr. {0},<br><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Please enter otp to complete your registration <b><br><br>
        Your OTP is :- <span style='color:red'>  {1} </spna> </b> please don't share to anyone.<br>
        <br><b> Thanks<br><br> Team Cybrom<br>    Bhopal Branch </b></body></html>""".format(email,otp)
        smtp = smtplib.SMTP(host='smtp.gmail.com', port=587)
        print("mail part11111++++") 
        smtp.starttls()
        smtp.login("dhirajdjangopython@gmail.com","tdilcffbrsczrtva")
        print("mail part2222++++") 
        msg = MIMEMultipart() 
        msg['From'] ="Dhiraj Patel"
        print("mail part3333++++")
        msg['To'] = email
        print("mail part44 email")
        msg['Subject'] = "Registration OTP"
        print("mail part55555 Subject++++")
        msg.attach(MIMEText(message, 'html'))
        print("mail part55 Message++++")
        smtp.send_message(msg)
        print("mail part777++++")
        smtp.quit()
        print("mail done+++++")      
        return True
    except Exception as ex:       
        return False


def sendotp(request):
    email = request.GET.get("email")
    print("your mail is+++++ ",email)
    if len(email)>0:
        email = email
        otp = generateOTP(6)
        print("your OTP is+++++ ",otp)
        check = sendmail(email,otp)
        print("sending mail+++++ ")
        request.session['loginotp'] = otp
        return HttpResponse("OTP Send Successfully! "+str(otp)+" ")
    else:
        return HttpResponse("OTP Send Failed, Please Try Again  !")           
                
    return HttpResponse("Email Id Not Exist !")



def forgotsendmail(email,otp):
    try:
        print("mail iniitializing")
        message ="""<html><body><h1 style='color:red'>Welcome to Cybrom</h1> <hr>Hello Mr. {0},<br><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Please enter otp to reset your password <b><br><br>
        Your OTP is :- <span style='color:red'>  {1} </spna> </b> please don't share to anyone.<br>
        <br><b> Thanks<br><br> Team Cybrom<br>    Bhopal Branch </b></body></html>""".format(email,otp)
        smtp = smtplib.SMTP(host='smtp.gmail.com', port=587)
        print("mail part11111++++") 
        smtp.starttls()
        smtp.login("dhirajdjangopython@gmail.com","tdilcffbrsczrtva")
        print("mail part2222++++") 
        msg = MIMEMultipart() 
        msg['From'] ="Dhiraj Patel"
        print("mail part3333++++")
        msg['To'] = email
        print("mail part44 email")
        msg['Subject'] = "Password reset OTP"
        print("mail part55555 Subject++++")
        msg.attach(MIMEText(message, 'html'))
        print("mail part55 Message++++")
        smtp.send_message(msg)
        print("mail part777++++")
        smtp.quit()
        print("mail done+++++")      
        return True
    except Exception as ex:       
        return False


def forgotsendotp(request):
    email = request.GET.get("email")
    print("your mail is+++++ ",email)
    if len(email)>0:
        email = email
        otp = generateOTP(6)
        print("your OTP is+++++ ",otp)
        check = forgotsendmail(email,otp)
        print("sending mail+++++ ")
        request.session['loginotp'] = otp
        return HttpResponse("OTP Send Successfully! "+str(otp)+" ")
    else:
        return HttpResponse("OTP Send Failed, Please Try Again  !")           
                
    return HttpResponse("Email Id Not Exist !")


def resetpass(req):
    email=req.POST.get("emailid1")
    print("converted email id",email)
    encryptedpassword=make_password(req.POST['password'])
    rpass=User.objects.get(email=email)
    rpass.password=encryptedpassword
    rpass.save()
    message ="""<html><body><h1 style='color:red'>Welcome to Cybrom</h1> <hr>Hello Mr."""+email+""",<br><br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    You have successfuly reset your password <b><br><br>
    Visit :- <span style='color:red'> http://127.0.0.1:8000/login/ </spna> </b> to login <br>
    <br><b> Thanks<br><br> Team Cybrom<br>    Bhopal Branch </b></body></html>"""
    smtp = smtplib.SMTP(host='smtp.gmail.com', port=587)
    print("mail part11111++++") 
    smtp.starttls()
    smtp.login("dhirajdjangopython@gmail.com","tdilcffbrsczrtva")
    print("mail part2222++++") 
    msg = MIMEMultipart() 
    msg['From'] ="Dhiraj Patel"
    print("mail part3333++++")
    msg['To'] = email
    print("mail part44 email")
    msg['Subject'] = "Password reset Done"
    print("mail part55555 Subject++++")
    msg.attach(MIMEText(message, 'html'))
    print("mail part55 Message++++")
    smtp.send_message(msg)
    print("mail part777++++")
    smtp.quit()
    print("mail done+++++")
    messages.success(req,'Password Changed Successfully')
    return redirect('login')
    

@login_required
def addstudentsdata(req):
    try:
        result=studentdetails()
        obuser=User()
        role1="Student"
        rollno=req.POST.get("rollno")
        name=req.POST.get("name")
        lastname=req.POST.get("name1")
        fathername=req.POST.get("father")
        fatherlastname=req.POST.get("father1")
        address=req.POST.get("add")
        email=req.POST.get("emailid")
        gender=req.POST.get("gender")
        p=req.POST.get("password")
        encryptedpassword=make_password(p)
        rollno1=rollno.upper()
        email1=email.lower()
        name1=name.upper()
        gender1=gender.upper()
        lastname1=lastname.upper()
        fathername1=fathername.upper()
        fatherlastname1=fatherlastname.upper()
        address1=address.upper()
        result.email=email1
        result.rollno=rollno1
        result.name=name1
        result.lastname=lastname1
        result.fathername=fathername1
        result.fatherlastname=fatherlastname1
        result.dob=req.POST.get("dob")
        result.doa=req.POST.get("doa")
        result.address=address1
        result.mobileno=req.POST.get("mobileno")
        result.gender=gender1
        obuser.username=email1
        obuser.email=email1
        obuser.password=encryptedpassword
        obuser.first_name=name1
        obuser.last_name=lastname1
        obuser.role=role1
        obuser.save()
        result.save()
        msg="student added successfuly"       
        return render(req,'base.html',{'msg':msg})    
    except Exception as ex:
        msg="Email already exist"       
        return render(req,'base.html',{'msg':msg})


@login_required
def modstu(req):
    if req.method=="POST":
        ids=req.POST.get("ids")
        modstu=studentdetails.objects.get(id=ids)
        modstu=studentdetails.objects.filter(id=ids)
        return render(req,'adminrole/updatestu.html',{'modstu':modstu})
    else:
        ids=req.GET.get("ids")
        modstu3=studentdetails.objects.get(id=ids)
        modstu3.email=req.GET.get("emailid")
        modstu3.mobileno=req.GET.get("mobileno")
        modstu3.name=req.GET.get("name")
        modstu3.lastname=req.GET.get("name1")
        modstu3.fathername=req.GET.get("father")
        modstu3.fatherlastname=req.GET.get("father1")
        modstu3.dob=req.GET.get("dob")
        modstu3.doa=req.GET.get("doa")
        modstu3.rollno=req.GET.get("rollno")
        modstu3.address=req.GET.get("add")
        modstu3.gender=req.GET.get("gender")
        modstu3.save()
        msg='Updated Successfully'
        return render(req,'base.html',{'msg':msg})


class showmarks(View):


    def get(self,req):
        try:
            marks=studentmarks.objects.all()
            return render(req,'adminrole/showallmarks.html',{'marks':marks})
        except Exception as ex:
            msg="No result found"       
            return render(req,'base.html',{'msg':msg})

class addmakshtml(View):

    def get(self,req):
        try:
            return render(req,'adminrole/addmarks.html')
        except Exception as ex:
            msg="Form Not Fund"       
            return render(req,'base.html',{'msg':msg})

  
@login_required
def editmarks(req):
    try:
        if req.method=="GET":
            ids=req.GET.get("ids")
            pdfs=studentmarks.objects.get(id=ids)
            pdfs=studentmarks.objects.filter(id=ids)
            return render(req,'adminrole/editmarks.html',{'pdfs':pdfs})
        else:
            marks=studentmarks.objects.all()
            ids=req.POST.get("ids")
            marksdata=studentmarks.objects.get(id=ids)
            marksdata.branch=req.POST.get("branch")
            marksdata.semester=req.POST.get("semester")
            marksdata.subject1=req.POST.get("subject1")
            marksdata.subjectcode1=req.POST.get("subjectcode1")
            marksdata.marks1=req.POST.get("mark1")
            marksdata.prac1=req.POST.get("prac1")
            marksdata.subject2=req.POST.get("subject2")
            marksdata.subjectcode2=req.POST.get("subjectcode2")
            marksdata.marks2=req.POST.get("mark2")
            marksdata.prac2=req.POST.get("prac2")
            marksdata.subject3=req.POST.get("subject3")
            marksdata.subjectcode3=req.POST.get("subjectcode3")
            marksdata.marks3=req.POST.get("mark3")
            marksdata.prac3=req.POST.get("prac3")
            marksdata.subject4=req.POST.get("subject4")
            marksdata.subjectcode4=req.POST.get("subjectcode4")
            marksdata.marks4=req.POST.get("mark4")
            marksdata.prac4=req.POST.get("prac4")
            marksdata.subject5=req.POST.get("subject5")
            marksdata.subjectcode5=req.POST.get("subjectcode5")
            marksdata.marks5=req.POST.get("mark5")
            marksdata.prac5=req.POST.get("prac5")
            marksdata.resultdate=req.POST.get("resultdate")
            marksdata.status=req.POST.get("status")
            marksdata.sessionyear=req.POST.get("sessionyear")
            marksdata.save()
            msg="Marks Updated"
            return render(req,'adminrole/showallmarks.html',{'marks':marks,'msg':msg})      
            #return render(req,'base.html',{'msg':msg})
    except Exception as ex:
        msg="Please fill add mandetatory data"       
        return render(req,'base.html',{'msg':msg})


@login_required
def exceluploadstu(request):
    try:
        if request.method == 'POST' and request.FILES['myfile']:      
            myfile = request. FILES['myfile']
            fs = FileSystemStorage()
            filename = fs.save(myfile.name, myfile)
            uploaded_file_url = fs.url(filename)              
            empexceldata = pd.read_excel(filename)        
            dbframe = empexceldata
            for dbframe in dbframe.itertuples():
                p="Student@123"
                encryptedpassword=make_password(p)
                obj = studentdetails.objects.create(email=dbframe.email.lower(), rollno=dbframe.rollno.upper(),  name=dbframe.name.upper(),  
                lastname=dbframe.lastname.upper(),  fathername=dbframe.fathername.upper(), fatherlastname=dbframe.fatherlastname.upper(),  
                mobileno=dbframe.mobileno,  gender=dbframe.gender.upper(),  dob=dbframe.dob, doa=dbframe.doa, address=dbframe.address.upper())
                obj2 = User.objects.create(email=dbframe.email.lower(), username=dbframe.email.lower(), first_name=dbframe.name.upper(), 
                last_name=dbframe.lastname.upper(), password=encryptedpassword, role="Student",rollno=dbframe.rollno.upper())           
                obj.save()
                obj2.save()
                messages.success(request,'Data Uploded Successfully')
        return HttpResponseRedirect('/')
    except IntegrityError as ex:
        messages.success(request,'Email id or Roll No Already Exist')
        return redirect('/')
    except Exception as ex:
        messages.success(request,'Header mismatch in exel sheet')       
        return redirect('/')


def exceluploadmarks(request):
    try:
        if request.method == 'POST' and request.FILES['myfile']:      
            myfile = request. FILES['myfile']
            fs = FileSystemStorage()
            filename = fs.save(myfile.name, myfile)
            uploaded_file_url = fs.url(filename)              
            empexceldata = pd.read_excel(filename)        
            dbframe = empexceldata
            for dbframe in dbframe.itertuples():
                obj = studentmarks.objects.create(rollno=dbframe.rollno,  branch=dbframe.branch,  
                    semester=dbframe.semester,  subject1=dbframe.subject1,  subjectcode1=dbframe.subjectcode1,  marks1=dbframe.marks1, 
                     prac1=dbframe.prac1,prac2=dbframe.prac2,prac3=dbframe.prac3,prac4=dbframe.prac4,prac5=dbframe.prac5,
                     subject2=dbframe.subject2,  subjectcode2=dbframe.subjectcode2,  marks2=dbframe.marks2,  subject3=dbframe.subject3, 
                      subjectcode3=dbframe.subjectcode3,  marks3=dbframe.marks3,  subject4=dbframe.subject4,  subjectcode4=dbframe.subjectcode4, 
                       marks4=dbframe.marks4,  subject5=dbframe.subject5,  subjectcode5=dbframe.subjectcode5,  marks5=dbframe.marks5,  
                        school=dbframe.school, resultdate=dbframe.resultdate, status=dbframe.status,sessionyear=dbframe.sessionyear)           
                obj.save()
                messages.success(request,'Data Uploded Successfully')
        return render(request,'adminrole/addmarks.html')
    except Exception as ex:
        messages.success(request,'Header mismatch in exel sheet')       
        return render(request,'adminrole/addmarks.html')


def viewresult(req):
    try:
        rollno=req.POST.get("rollno")
        details=studentmarks.objects.filter(rollno=rollno)
        return render(req,'student/viewresult.html',{'details':details})
    except Exception as ex:
        msg="Rseult Not Fund"       
        return render(req,'base.html',{'msg':msg})

def marksheet(req):
    totaltp={}
    grades={}
    rollno=req.POST.get("rollno")
    semester=req.POST.get("semester")
    marks=studentmarks.objects.filter(rollno=rollno, semester=semester)
    details=studentmarks.objects.filter(rollno=rollno)
    details2=studentdetails.objects.filter(rollno=rollno)
    for i in marks:
        m1=int(i.marks1)
        m2=int(i.marks2)
        m3=int(i.marks3)
        m4=int(i.marks4)
        m5=int(i.marks5)
        pm1=int(i.prac1)
        pm2=int(i.prac2)
        pm3=int(i.prac3)
        pm4=int(i.prac4)
        pm5=int(i.prac5)
        total1=m1+pm1
        total2=m2+pm2
        total3=m3+pm3
        total4=m4+pm4
        total5=m5+pm5
        subtotal=total1+total2+total3+total4+total5

        CGPAraw=(subtotal/500)*10
        CGPA=round(CGPAraw, 1)

        words1=((num2words(total1)))
        words2=(num2words(total2))
        words3=(num2words(total3))
        words4=(num2words(total4))
        words5=(num2words(total5))
        word1=words1.upper()
        word2=words2.upper()
        word3=words3.upper()
        word4=words4.upper()
        word5=words5.upper()

        totaltp={'t1':total1,'t2':total2,'t3':total3,'t4':total4,'t5':total5,'subtotal':subtotal,'CGPA':CGPA,'word1':word1,'word2':word2,'word3':word3,'word4':word4,'word5':word5}
        
        if(total1 <= 100 and total1 >= 96 and m1>32.9):
            grade="A++"
        elif(total1 <= 95 and total1 >= 90 and m1>32.9):
            grade="A+"
        elif(total1 <= 89 and total1 >= 80 and m1>32.9):
            grade="A"
        elif(total1 <= 79 and total1 >= 70 and m1>32.9):
            grade="B+"
        elif(total1 <= 69 and total1 >= 60 and m1>32.9):
            grade="B" 
        elif(total1 <= 59 and total1 >= 50 and m1>32.9): 
            grade="C+"
        elif(total1 <= 49 and total1 >= 33 and m1>32.9):
            grade="C"
        else:
            grade="F"

        if(total2 <= 100 and total2 >= 96 and m2>32.9):
            grade2="A++"
        elif(total2 <= 95 and total2 >= 90 and m2>32.9):
            grade2="A+"
        elif(total2 <= 89 and total2 >= 80 and m2>32.9):
            grade2="A"
        elif(total2 <= 79 and total2 >= 70 and m2>32.9):
            grade2="B+"
        elif(total2 <= 69 and total2 >= 60 and m2>32.9):
            grade2="B" 
        elif(total2 <= 59 and total2 >= 50 and m2>32.9): 
            grade2="C+"
        elif(total2 <= 49 and total2 >= 33 and m2>32.9):
            grade2="C"
        else:
            grade2="F"

        if(total3 <= 100 and total3 >= 96 and m3>32.9):
            grade3="A++"
        elif(total3 <= 95 and total3 >= 90 and m3>32.9):
            grade3="A+"
        elif(total3 <= 89 and total3 >= 80 and m3>32.9):
            grade3="A"
        elif(total3 <= 79 and total3 >= 70 and m3>32.9):
            grade3="B+"
        elif(total3 <= 69 and total3 >= 60 and m3>32.9):
            grade3="B" 
        elif(total3 <= 59 and total3 >= 50 and m3>32.9): 
            grade3="C+"
        elif(total3 <= 49 and total3 >= 33 and m3>32.9):
            grade3="C"
        else:
            grade3="F"

        if(total4 <= 100 and total4 >= 96 and m4>32.9):
            grade4="A++"
        elif(total4 <= 95 and total4 >= 90 and m4>32.9):
            grade4="A+"
        elif(total4 <= 89 and total4 >= 80 and m4>32.9):
            grade4="A"
        elif(total4 <= 79 and total4 >= 70 and m4>32.9):
            grade4="B+"
        elif(total4 <= 69 and total4 >= 60 and m4>32.9):
            grade4="B" 
        elif(total4 <= 59 and total4 >= 50 and m4>32.9): 
            grade4="C+"
        elif(total4 <= 49 and total4 >= 33 and m4>32.9):
            grade4="C"
        else:
            grade4="F"

        if(total5 <= 100 and total5 >= 96 and m5>32.9):
            grade5="A++"
        elif(total5 <= 95 and total5 >= 90 and m5>32.9):
            grade5="A+"
        elif(total4 <= 89 and total5 >= 80 and m5>32.9):
            grade5="A"
        elif(total5 <= 79 and total5 >= 70 and m5>32.9):
            grade5="B+"
        elif(total5 <= 69 and total5 >= 60 and m5>32.9):
            grade5="B" 
        elif(total5 <= 59 and total5 >= 50 and m5>32.9): 
            grade5="C+"
        elif(total5 <= 49 and total5 >= 33 and m5>32.9):
            grade5="C"
        else:
            grade5="F"

        if(grade=="F" or grade2=="F" or grade3=="F" or grade4=="F" or grade5=="F"):
            result="FAIL"
        else:
            result="PASS"
        grades={'grade':grade,'grade2':grade2,'grade3':grade3,'grade4':grade4,'grade5':grade5,'result':result}
    return render(req,'student/viewresult.html',{'marks':marks,'details':details,'details2':details2,'totaltp':totaltp,'grades':grades})                    

def search(req):
    marks=studentmarks.objects.all()
    sem=req.POST.get("sem")
    rollnonew=req.POST.get("rollno")
    marks3=studentmarks.objects.filter(rollno=rollnonew)
    for i in marks3:
        if( i.rollno!=rollnonew and i.semester!=sem):
            msg="semester not found"       
        else:
            marks2=studentmarks.objects.filter(rollno=rollnonew, semester=sem)
            return render(req,'adminrole/search.html',{'marks2':marks2})   
    msg="Rollno Not Found"     
    return render(req,'adminrole/showallmarks.html',{'marks':marks,'msg':msg})

def viewresultweb(req):
    return render(req,'adminrole/resultdownload.html')
    

def webresult(req):
    try:
        totaltp={}
        grades={}
        rollno=req.POST.get("rollno")
        semester=req.POST.get("semester")
        session=req.POST.get("session")
        marks=studentmarks.objects.filter(rollno=rollno, semester=semester,sessionyear=session)
        for i in marks:
            if( i.rollno!=rollno and i.semester!=semester and i.session!=session):
                messages.success(req,'Rollno Not found')       
                return redirect('/viewresult')    
            else:
                details=studentmarks.objects.filter(rollno=rollno)
                details2=studentdetails.objects.filter(rollno=rollno)
                for i in marks:
                    m1=int(i.marks1)
                    m2=int(i.marks2)
                    m3=int(i.marks3)
                    m4=int(i.marks4)
                    m5=int(i.marks5)
                    pm1=int(i.prac1)
                    pm2=int(i.prac2)
                    pm3=int(i.prac3)
                    pm4=int(i.prac4)
                    pm5=int(i.prac5)
                    total1=m1+pm1
                    total2=m2+pm2
                    total3=m3+pm3
                    total4=m4+pm4
                    total5=m5+pm5
                    subtotal=total1+total2+total3+total4+total5

                    CGPAraw=(subtotal/500)*10
                    CGPA=round(CGPAraw, 1)

                    words1=((num2words(total1)))
                    words2=(num2words(total2))
                    words3=(num2words(total3))
                    words4=(num2words(total4))
                    words5=(num2words(total5))
                    word1=words1.upper()
                    word2=words2.upper()
                    word3=words3.upper()
                    word4=words4.upper()
                    word5=words5.upper()

                    totaltp={'t1':total1,'t2':total2,'t3':total3,'t4':total4,'t5':total5,'subtotal':subtotal,'CGPA':CGPA,'word1':word1,'word2':word2,'word3':word3,'word4':word4,'word5':word5}
                    
                    if(total1 <= 100 and total1 >= 96 and m1>32.9):
                        grade="A++"
                    elif(total1 <= 95 and total1 >= 90 and m1>32.9):
                        grade="A+"
                    elif(total1 <= 89 and total1 >= 80 and m1>32.9):
                        grade="A"
                    elif(total1 <= 79 and total1 >= 70 and m1>32.9):
                        grade="B+"
                    elif(total1 <= 69 and total1 >= 60 and m1>32.9):
                        grade="B" 
                    elif(total1 <= 59 and total1 >= 50 and m1>32.9): 
                        grade="C+"
                    elif(total1 <= 49 and total1 >= 33 and m1>32.9):
                        grade="C"
                    else:
                        grade="F"

                    if(total2 <= 100 and total2 >= 96 and m2>32.9):
                        grade2="A++"
                    elif(total2 <= 95 and total2 >= 90 and m2>32.9):
                        grade2="A+"
                    elif(total2 <= 89 and total2 >= 80 and m2>32.9):
                        grade2="A"
                    elif(total2 <= 79 and total2 >= 70 and m2>32.9):
                        grade2="B+"
                    elif(total2 <= 69 and total2 >= 60 and m2>32.9):
                        grade2="B" 
                    elif(total2 <= 59 and total2 >= 50 and m2>32.9): 
                        grade2="C+"
                    elif(total2 <= 49 and total2 >= 33 and m2>32.9):
                        grade2="C"
                    else:
                        grade2="F"

                    if(total3 <= 100 and total3 >= 96 and m3>32.9):
                        grade3="A++"
                    elif(total3 <= 95 and total3 >= 90 and m3>32.9):
                        grade3="A+"
                    elif(total3 <= 89 and total3 >= 80 and m3>32.9):
                        grade3="A"
                    elif(total3 <= 79 and total3 >= 70 and m3>32.9):
                        grade3="B+"
                    elif(total3 <= 69 and total3 >= 60 and m3>32.9):
                        grade3="B" 
                    elif(total3 <= 59 and total3 >= 50 and m3>32.9): 
                        grade3="C+"
                    elif(total3 <= 49 and total3 >= 33 and m3>32.9):
                        grade3="C"
                    else:
                        grade3="F"

                    if(total4 <= 100 and total4 >= 96 and m4>32.9):
                        grade4="A++"
                    elif(total4 <= 95 and total4 >= 90 and m4>32.9):
                        grade4="A+"
                    elif(total4 <= 89 and total4 >= 80 and m4>32.9):
                        grade4="A"
                    elif(total4 <= 79 and total4 >= 70 and m4>32.9):
                        grade4="B+"
                    elif(total4 <= 69 and total4 >= 60 and m4>32.9):
                        grade4="B" 
                    elif(total4 <= 59 and total4 >= 50 and m4>32.9): 
                        grade4="C+"
                    elif(total4 <= 49 and total4 >= 33 and m4>32.9):
                        grade4="C"
                    else:
                        grade4="F"

                    if(total5 <= 100 and total5 >= 96 and m5>32.9):
                        grade5="A++"
                    elif(total5 <= 95 and total5 >= 90 and m5>32.9):
                        grade5="A+"
                    elif(total4 <= 89 and total5 >= 80 and m5>32.9):
                        grade5="A"
                    elif(total5 <= 79 and total5 >= 70 and m5>32.9):
                        grade5="B+"
                    elif(total5 <= 69 and total5 >= 60 and m5>32.9):
                        grade5="B" 
                    elif(total5 <= 59 and total5 >= 50 and m5>32.9): 
                        grade5="C+"
                    elif(total5 <= 49 and total5 >= 33 and m5>32.9):
                        grade5="C"
                    else:
                        grade5="F"

                    if(grade=="F" or grade2=="F" or grade3=="F" or grade4=="F" or grade5=="F"):
                        result="FAIL"
                    else:
                        result="PASS"
                    grades={'grade':grade,'grade2':grade2,'grade3':grade3,'grade4':grade4,'grade5':grade5,'result':result}
                return render(req,'adminrole/webviewresult.html',{'marks':marks,'details':details,'details2':details2,'totaltp':totaltp,'grades':grades})                    
    except Exception as ex:
        messages.success(req,'Result not found')       
        return redirect('/viewresult')
    messages.success(req,'Result not found')       
    return redirect('/viewresultweb')

def studentfeecard(req):
    return render(req,'student/fee.html')
    """rollno=req.GET.get("rollno")
    print(rollno, "my dattaaaaaaaa")
    pdfs2=studentmarks.objects.get(rollno=rollno)
    pdfs2=studentmarks.objects.filter(rollno=rollno)
    return render(req,'student/fee.html',{'pdfs2':pdfs2})"""


def feedetail(req):
    rollno=req.POST.get("rollno")
    session=req.POST.get("session")
    month=req.POST.get("month")
    feedetail1=studentfee.objects.filter(rollno=rollno,sessionyear=session,month=month)
    details=studentdetails.objects.filter(rollno=rollno)
    for i in feedetail1:
        if( i.rollno!=rollno and i.sessionyear!=session and i.month!=month):
            messages.success(req,"Fee Detail Not Found")
            return render(req,'student/fee.html')  
        else:
            feedetail=studentfee.objects.filter(rollno=rollno, sessionyear=session,month=month)
            return render(req,'student/fee.html',{'details':details,'feedetail':feedetail})
    messages.success(req,"Fee Detail Not Found")  
    return render(req,'student/fee.html')


def feeupload(req):
    return render(req,'adminrole/uploadfee.html')


def exceluploadfee(request):
    try:
        if request.method == 'POST' and request.FILES['myfile']:      
            myfile = request. FILES['myfile']
            fs = FileSystemStorage()
            filename = fs.save(myfile.name, myfile)
            uploaded_file_url = fs.url(filename)              
            empexceldata = pd.read_excel(filename)        
            dbframe = empexceldata
            for dbframe in dbframe.itertuples():
                obj = studentfee.objects.create(rollno=dbframe.rollno, latefine=dbframe.latefine, 
                    paiddate=dbframe.paiddate, month=dbframe.month, pendingamount=dbframe.pendingamount, 
                    paidamount=dbframe.paidamount,sessionyear=dbframe.sessionyear)           
                obj.save()
                messages.success(request,'Data Uploded Successfully')
        return redirect('/feeupload')
    except IntegrityError as ex:
        messages.success(request,'Email id or Roll No Already Exist')
        return redirect('/')
    except Exception as ex:
        messages.success(request,'Data mismatch in exel sheet')       
        return redirect('/feeupload')


def searchfee(req):
    roll=req.POST.get("rollno")
    session=req.POST.get("session")
    fees=studentfee.objects.filter(rollno=roll, sessionyear=session)
    for i in fees:
        if( i.rollno!=roll and i.semester!=session):
            messages.success(req,"Roll or Session Not found")   
        else:
            fees=studentfee.objects.filter(rollno=roll, sessionyear=session)
            return render(req,'adminrole/showallfees.html',{'fees':fees})   
    messages.success(req,"Roll or Session Not found")  
    return redirect('/feeupload')


def studentshowallfee(req):
    roll=req.POST.get("roll")
    fees=studentfee.objects.filter(rollno=roll)
    for i in fees:
        if( i.rollno!=roll):
            messages.success(req,"Fee Detail Not Found")   
        else:
            fees=studentfee.objects.filter(rollno=roll)
            return render(req,'student/studentallfee.html',{'fees':fees})   
    messages.success(req,"Fee Detail Not Founds")  
    return render(req,'student/fee.html')


class showfee(View):


    def get(self,req):
        try:
            fees=studentfee.objects.all()
            studetails=studentdetails.objects.all()
            return render(req,'adminrole/showallfees.html',{'fees':fees,'studetails':studetails})
        except Exception as ex:
            msg="No result found"       
            return render(req,'adminrole/uploadfee.html',{'msg':msg})


def addfees(req):
    return render(req,'adminrole/addfee.html')

def addfeesdata(req):
    try:
        feedata=studentfee()
        feedata.rollno=req.POST.get("rollno")
        feedata.sessionyear=req.POST.get("sessionyear")
        feedata.month=req.POST.get("month")
        feedata.latefine=req.POST.get("latefine")
        feedata.pendingamount=req.POST.get("pendingamount")
        feedata.paidamount=req.POST.get("paidamount")
        feedata.paiddate=req.POST.get("paiddate")
        feedata.save()
        messages.success(req,"Fee Updated Successfully")  
        return redirect('/feeupload')
    except Exception as ex:
        msg="Please fill add mandetatory data"       
        return render(req,'adminrole/addfee.html',{'msg':msg})


@login_required
def addmarkview(req):
    try:
        marksdata=studentmarks()
        marksdata.rollno=req.POST.get("rollno")
        marksdata.branch=req.POST.get("branch")
        marksdata.semester=req.POST.get("semester")
        marksdata.subject1=req.POST.get("subject1")
        marksdata.subjectcode1=req.POST.get("subjectcode1")
        marksdata.marks1=req.POST.get("mark1")
        marksdata.prac1=req.POST.get("prac1")
        marksdata.subject2=req.POST.get("subject2")
        marksdata.subjectcode2=req.POST.get("subjectcode2")
        marksdata.marks2=req.POST.get("mark2")
        marksdata.prac2=req.POST.get("prac2")
        marksdata.subject3=req.POST.get("subject3")
        marksdata.subjectcode3=req.POST.get("subjectcode3")
        marksdata.marks3=req.POST.get("mark3")
        marksdata.prac3=req.POST.get("prac3")
        marksdata.subject4=req.POST.get("subject4")
        marksdata.subjectcode4=req.POST.get("subjectcode4")
        marksdata.marks4=req.POST.get("mark4")
        marksdata.prac4=req.POST.get("prac4")
        marksdata.subject5=req.POST.get("subject5")
        marksdata.subjectcode5=req.POST.get("subjectcode5")
        marksdata.marks5=req.POST.get("mark5")
        marksdata.prac5=req.POST.get("prac5")
        marksdata.resultdate=req.POST.get("resultdate")
        marksdata.status=req.POST.get("status")
        marksdata.sessionyear=req.POST.get("sessionyear")
        marksdata.school=req.POST.get("school")
        marksdata.save()
        msg="Marks Upoaded Successfully"
        marks=studentmarks.objects.all()
        return render(req,'adminrole/showallmarks.html',{'marks':marks,'msg':msg})
    except Exception as ex:
        msg="Please fill add mandetatory data"       
        return render(req,'adminrole/addmarks.html',{'msg':msg})


def logoutUser(request):
    logout(request)
    return redirect('login')


class signuptask(View):

    def get(self,request):
        encryptedpassword=make_password(request.GET['password'])
        ob=User()
        ob2=studentdetails()
        ob.username=request.GET.get("username")
        ob.mobileno=request.GET.get("mobileno")
        ob.email=request.GET.get("emailid")
        ob.first_name=request.GET.get("name")
        ob.last_name=request.GET.get("name1")
        ob.password=encryptedpassword
        ob.gender=request.GET.get("gender")
        ob2.email=request.GET.get("emailid")
        ob2.first_name=request.GET.get("name")
        ob2.last_name=request.GET.get("name1")
        ob2.save()
        ob.save()
        return redirect("/")