# Generated by Django 4.0.2 on 2022-04-01 04:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('teamformation', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teammates',
            name='info',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
