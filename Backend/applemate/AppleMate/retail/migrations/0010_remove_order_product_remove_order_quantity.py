# Generated by Django 4.2.17 on 2025-03-20 16:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('retail', '0009_orderitem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='product',
        ),
        migrations.RemoveField(
            model_name='order',
            name='quantity',
        ),
    ]
