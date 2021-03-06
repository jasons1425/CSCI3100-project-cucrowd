# Generated by Django 4.0.2 on 2022-04-01 03:30

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import teamformation.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user_auth', '0010_alter_orguserprofile_date_of_birth'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Teamformation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(default='Please type the title here.', help_text='Please enter the title', max_length=100)),
                ('self_intro', models.TextField(default='Please type something about yourself here.', help_text='Please type a short self-introduction.(around 100 words)', max_length=100)),
                ('description', models.TextField(default='Please type the description here.', help_text='Please type a short description.(around 200 words)', max_length=200)),
                ('requirements', models.TextField(default='Please type the requirements here.', help_text='Please type your requirements that team members need.(around 100 words)', max_length=100)),
                ('link', models.TextField(blank=True, default='Please type the links here.', help_text='Please enter the links that you need.(if available)', max_length=300, null=True)),
                ('contact', models.TextField(default='Please type the contact here.', help_text='Please type your contact. (Email , Phone number, etc...)', max_length=100)),
                ('deadline', models.DateField(default=datetime.date.today, validators=[teamformation.models.validate_deadline])),
                ('post_date', models.DateField(auto_now_add=True)),
                ('last_modified', models.DateField(auto_now=True)),
                ('teamsize', models.IntegerField(default='Please type the teamsize here.', help_text='Please enter an integer number. (Minimum is 2 and Maximum is 5)', validators=[teamformation.models.validate_size])),
                ('team_img', models.ImageField(blank=True, null=True, upload_to=teamformation.models.get_team_fp)),
                ('host', models.ForeignKey(blank=True, editable=False, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Teammates',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('info', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_auth.studentprofile')),
                ('teamformation', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='teamformation.teamformation')),
            ],
        ),
    ]
