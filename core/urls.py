from django.urls import path
from core.views import ProfileView,Imageview,ProfileUpdate,mysingup,signuptask,forgotpassword,addstudent,showstu,\
showmarks,addmakshtml,showfee
from django.contrib.auth import views as auth_views
from django.contrib.auth import views
from core import urls as core_urls
from django_user import urls
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('signup', mysingup.as_view(), name='signup'),
    path('signuptask', signuptask.as_view(), name='signuptask'),
    path('forgotpass', forgotpassword.as_view(), name='forgotpass'),
    path('showstu', showstu.as_view(), name='showstu'),
    path('addstu', addstudent.as_view(), name='addstu'),
    path('modstu', views.modstu),
    path('modstu', views.editmarks),
    path('resetpass', views.resetpass),
    path('editmark', views.editmarks),
    path('marksheet', views.marksheet),
    path('viewresult', views.viewresult),
    path('imageupdate', views.Imageupdate),
    path('addstudentsdata', views.addstudentsdata),
    path('showmarks', showmarks.as_view(), name='showmarks'),
    path('showfee', showfee.as_view(), name='showfee'),
    path('addmark', views.addmarkview),
    path('addmarks', addmakshtml.as_view(), name='addmarks'),
    path('sendotp', views.sendotp),
    path('forgotsendotp', views.forgotsendotp),
    path('cheksignup', views.cheksignup),
    path('profile',ProfileView.as_view(), name='profile'),
    path('imageview',Imageview.as_view(), name='imageview'),
    path('profileupdate/<int:pk>', ProfileUpdate.as_view(),name='profileupdate'),
    path('uploadstu', views.exceluploadstu),
    path('uploadmarks', views.exceluploadmarks),
    path('feesupload', views.exceluploadfee),
    path('search', views.search),
    path('searchfee', views.searchfee),
    path('webresult', views.webresult),
    path('viewresultweb', views.viewresultweb),
    path('studentfeecard', views.studentfeecard),
    path('feedetail', views.feedetail),
    path('feeupload', views.feeupload),
    path('addfees', views.addfees),
    path('studentshowallfee', views.studentshowallfee),
    path('addfeesdata', views.addfeesdata),
    path('logout', views.logoutUser, name="logout"),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)