# Generated by Django 4.0.2 on 2022-03-26 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0009_orguserprofile_org_email_orguserprofile_org_intro_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orguserprofile',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
    ]
