# Generated by Django 4.0.2 on 2022-03-24 11:54

from django.db import migrations, models
import django.utils.timezone
import user_auth.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0006_remove_orguserprofile_id_remove_studentprofile_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='crowduser',
            name='avatar',
        ),
        migrations.RemoveField(
            model_name='crowduser',
            name='date_of_birth',
        ),
        migrations.RemoveField(
            model_name='crowduser',
            name='gender',
        ),
        migrations.AddField(
            model_name='orguserprofile',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=user_auth.models.get_avatar_fp),
        ),
        migrations.AddField(
            model_name='orguserprofile',
            name='date_of_birth',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='orguserprofile',
            name='gender',
            field=models.CharField(choices=[('M', 'male'), ('F', 'female'), ('NA', 'others')], default='NA', max_length=2),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=user_auth.models.get_avatar_fp),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='date_of_birth',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='gender',
            field=models.CharField(choices=[('M', 'male'), ('F', 'female'), ('NA', 'others')], default='NA', max_length=2),
        ),
    ]
