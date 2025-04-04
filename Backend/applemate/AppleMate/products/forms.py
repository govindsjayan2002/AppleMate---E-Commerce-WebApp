from django import forms
from .models import Product

class BillingForm(forms.Form):
    product = forms.ModelChoiceField(queryset=Product.objects.all())
    quantity = forms.IntegerField(min_value=1)
    price_type = forms.ChoiceField(choices=[('normal', 'Normal Price'), ('retail', 'Retail Price'), ('wholesale', 'Wholesale Price')])
