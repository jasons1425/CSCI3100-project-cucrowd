# Generated by Django 4.0.2 on 2022-03-02 13:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0004_studentprofile_sid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='crowduser',
            name='create_time',
        ),
    ]
