"""django_user URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
#from django.contrib.auth import views
from core import urls as core_urls
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views
from django.core.mail import send_mail, BadHeaderError


urlpatterns = [
    path('pateladmin', admin.site.urls),
    path('', include(core_urls)),

    # Login and Logout
    path('login', auth_views.LoginView.as_view(redirect_authenticated_user=True, template_name='commons/login.html'), name='login'),
    path('logout', auth_views.LogoutView.as_view(next_page='login'), name='logout'),

    # Main Page 
    path('', TemplateView.as_view(template_name='base.html'), name='home'),

    # Change Password
    path('change-password',auth_views.PasswordChangeView.as_view(template_name='commons/change-password.html',success_url = '/'),
        name='change_password'),

    # Forget Password
    path('login/password-reset/',
         auth_views.PasswordResetView.as_view(
             template_name='commons/password-reset/password_reset.html',
             subject_template_name='commons/password-reset/password_reset_subject.txt',
             email_template_name='commons/password-reset/password_reset_email.html',
             success_url='/checkmail/'
         ),
         name='password_reset'),
    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(
             template_name='commons/password-reset/password_reset_done.html'
         ),
         name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='commons/password-reset/password_reset_confirm.html'
         ),
         name='password_reset_confirm'),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='commons/password-reset/password_reset_complete.html'
         ),
         name='password_reset_complete'),
    # Course view
    path('course', TemplateView.as_view(template_name='site/courses.html'), name='course'),

     # Contact
    path('contact', TemplateView.as_view(template_name='site/contactus.html'), name='contact'),

    # about view
    path('about', TemplateView.as_view(template_name='site/about.html'), name='about'),

    path('checkmail/', TemplateView.as_view(template_name='site/mail.html'), name='checkmail'),

    #testmail
    # Change Password
    #path('profile/', auth_views.LoginView.as_view(redirect_authenticated_user=True, template_name='commons/profile.html'), name='profile'),

     # about view
    #path('resetpass/', TemplateView.as_view(template_name='commons/password-reset/password_reset.html'), name='resetpass'),

]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)




