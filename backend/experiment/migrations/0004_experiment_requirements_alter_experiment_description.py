# Generated by Django 4.0.2 on 2022-03-24 08:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiment', '0003_alter_enrollment_experiment_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='requirements',
            field=models.TextField(default='Anyone', max_length=150),
        ),
        migrations.AlterField(
            model_name='experiment',
            name='description',
            field=models.TextField(default='Enter description for the experiments (max 1000 words)', max_length=1000),
        ),
    ]
