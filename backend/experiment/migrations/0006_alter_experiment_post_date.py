# Generated by Django 4.0.2 on 2022-03-30 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiment', '0005_alter_experiment_duration_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experiment',
            name='post_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
