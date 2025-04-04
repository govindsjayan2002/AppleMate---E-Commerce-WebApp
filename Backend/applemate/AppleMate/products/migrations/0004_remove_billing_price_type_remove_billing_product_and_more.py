# Generated by Django 4.2.17 on 2025-04-03 05:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_billing_price_type_billing_product_billing_quantity_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='billing',
            name='price_type',
        ),
        migrations.RemoveField(
            model_name='billing',
            name='product',
        ),
        migrations.RemoveField(
            model_name='billing',
            name='quantity',
        ),
        migrations.CreateModel(
            name='BillItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('price_type', models.CharField(choices=[('normal', 'Normal'), ('retail', 'Retail'), ('wholesale', 'Wholesale')], default='normal', max_length=20)),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.billing')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product')),
            ],
        ),
    ]
