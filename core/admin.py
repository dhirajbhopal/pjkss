from django.contrib import admin
#from student.models import student
#from faculty.models import faculty
from core.models import User,studentdetails,studentmarks,studentfee
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

# Register your models here.

"""@admin.register(faculty)
class facultyAdmin(admin.ModelAdmin):
	list_display=['id','name'  ,  'email',  'mobileno'  ,  'subject'  ,  'image']"""




@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        (None,{"fields": ("username","email", "password")}),
        (("Personal info"), {"fields": ("first_name", "last_name","role","image","rollno")}),
        (
            ("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_display = ("email", "is_active", "is_staff", "is_superuser")
    list_filter = ("is_active", "is_staff", "is_superuser")
    search_fields = ("email",)
    ordering = ("email",)
    filter_horizontal = ("groups", "user_permissions",)


@admin.register(studentdetails)
class studentdetailsAdmin(admin.ModelAdmin):
    list_display=['email','rollno'  , 'name'  , 'lastname'  ,  'fathername'  ,  'fatherlastname'    ,  'mobileno'  , 
     'gender'  ,  'dob'  ,  'doa'  ,  'address']

@admin.register(studentmarks)
class studentmarksAdmin(admin.ModelAdmin):
    list_display=['rollno' , 'branch','semester', 'subject1'  , 'subjectcode1','marks1','prac1' ,'subject2'  , 
    'subjectcode2','marks2','prac2'  ,'subject3'  ,'subjectcode3' ,'marks3','prac3' ,'subject4'  , 'subjectcode4','marks4','prac4' 
    ,'subject5' ,'marks5','prac5' , 'subjectcode5','school' , 'resultdate']


@admin.register(studentfee)
class studentfeeAdmin(admin.ModelAdmin):
    list_display=['rollno'  , 'month','pendingamount','latefine','paidamount', 
     'paiddate'  ,  'sessionyear']



