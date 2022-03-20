# Generated by Django 4.0.2 on 2022-03-20 11:12

from django.db import migrations, models
import experiment.models


class Migration(migrations.Migration):

    dependencies = [
        ('experiment', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='enrollment',
            name='time',
        ),
        migrations.AddField(
            model_name='enrollment',
            name='selected_time',
            field=models.TextField(default='Enter each allowed time delimited by `;`, e.g. 2022-03-27-16:00;2022-03-28-17:00', max_length=1000, validators=[experiment.models.validate_time_string]),
        ),
        migrations.AddField(
            model_name='experiment',
            name='timeslots',
            field=models.TextField(default='Enter each allowed time delimited by `;`, e.g. 2022-03-27-16:00;2022-03-28-17:00', max_length=1000, validators=[experiment.models.validate_time_string]),
        ),
    ]
