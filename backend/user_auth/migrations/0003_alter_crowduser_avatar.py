# Generated by Django 4.0.2 on 2022-03-02 11:04

from django.db import migrations, models
import user_auth.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0002_alter_crowduser_date_of_birth'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crowduser',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=user_auth.models.get_avatar_fp),
        ),
    ]
