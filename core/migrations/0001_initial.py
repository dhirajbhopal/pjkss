# Generated by Django 4.2.7 on 2024-10-11 07:58

import core.models
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='studentdetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=50)),
                ('lastname', models.CharField(max_length=50)),
                ('fathername', models.CharField(blank=True, max_length=30)),
                ('fatherlastname', models.CharField(blank=True, max_length=30)),
                ('mobileno', models.CharField(blank=True, max_length=15)),
                ('gender', models.CharField(blank=True, max_length=10, null=True)),
                ('dob', models.DateField(blank=True, null=True)),
                ('doa', models.DateField(blank=True, null=True)),
                ('address', models.CharField(blank=True, max_length=200)),
                ('rollno', models.CharField(blank=True, max_length=20, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='studentfee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rollno', models.CharField(max_length=20)),
                ('month', models.CharField(max_length=20)),
                ('pendingamount', models.CharField(max_length=20)),
                ('paidamount', models.CharField(max_length=20)),
                ('latefine', models.CharField(max_length=20)),
                ('paiddate', models.DateField()),
                ('sessionyear', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='studentmarks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rollno', models.CharField(max_length=20)),
                ('branch', models.CharField(max_length=40)),
                ('semester', models.CharField(max_length=15)),
                ('subject1', models.CharField(max_length=100)),
                ('subjectcode1', models.CharField(max_length=30)),
                ('marks1', models.CharField(max_length=30)),
                ('prac1', models.CharField(max_length=30)),
                ('subject2', models.CharField(max_length=100)),
                ('subjectcode2', models.CharField(max_length=30)),
                ('marks2', models.CharField(max_length=30)),
                ('prac2', models.CharField(max_length=30)),
                ('subject3', models.CharField(max_length=100)),
                ('subjectcode3', models.CharField(max_length=30)),
                ('marks3', models.CharField(max_length=30)),
                ('prac3', models.CharField(max_length=30)),
                ('subject4', models.CharField(max_length=100)),
                ('subjectcode4', models.CharField(max_length=30)),
                ('marks4', models.CharField(max_length=30)),
                ('prac4', models.CharField(max_length=30)),
                ('subject5', models.CharField(max_length=100)),
                ('subjectcode5', models.CharField(max_length=30)),
                ('marks5', models.CharField(max_length=30)),
                ('prac5', models.CharField(max_length=30)),
                ('school', models.CharField(max_length=200)),
                ('resultdate', models.DateField()),
                ('status', models.CharField(max_length=30)),
                ('sessionyear', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('username', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('image', models.ImageField(blank=True, default='static/images/cybromlogo.webp', null=True, upload_to=core.models.filepathadmin)),
                ('role', models.CharField(blank=True, max_length=15, null=True)),
                ('mobileno', models.CharField(blank=True, max_length=15, null=True)),
                ('gender', models.CharField(blank=True, max_length=15, null=True)),
                ('rollno', models.CharField(blank=True, max_length=20, unique=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
    ]
