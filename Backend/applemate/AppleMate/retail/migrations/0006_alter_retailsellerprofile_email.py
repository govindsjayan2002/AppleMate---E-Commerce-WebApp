# Generated by Django 4.2.17 on 2025-02-18 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('retail', '0005_retailsellerprofile_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='retailsellerprofile',
            name='email',
            field=models.EmailField(blank=True, max_length=100, null=True),
        ),
    ]
