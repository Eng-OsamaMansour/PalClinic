# Generated by Django 5.2 on 2025-04-25 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalProfile', '0002_remove_treatmentplan_profile_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='treatment',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
