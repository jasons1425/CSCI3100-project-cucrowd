# Generated by Django 4.0.2 on 2022-03-02 12:40

from django.db import migrations, models
import user_auth.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0003_alter_crowduser_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentprofile',
            name='sid',
            field=models.CharField(default=1234567890, max_length=10, validators=[user_auth.models.validate_sid]),
            preserve_default=False,
        ),
    ]
