# Generated by Django 4.0.2 on 2022-03-06 06:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('experiment', '0003_experiment_host'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experiment',
            name='host',
            field=models.ForeignKey(blank=True, editable=False, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
