from django.contrib import admin
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path
from django.utils.html import format_html
from django.contrib import messages
from django.forms import formset_factory, BaseFormSet
from django import forms
from .models import Billing, BillItem, Product, Category


class BillItemForm(forms.Form):
    product = forms.ModelChoiceField(queryset=Product.objects.all(), required=True)
    quantity = forms.IntegerField(min_value=1, required=True)
    price_type = forms.ChoiceField(
        choices=[
            ('normal', 'Normal'),
            ('retail', 'Retail'),
            ('wholesale', 'Wholesale')
        ],
        required=True
    )


class BillItemInline(admin.TabularInline):
    model = BillItem
    extra = 0
    fields = ('product', 'quantity', 'price_type', 'unit_price', 'total_price')
    readonly_fields = ('unit_price', 'total_price')


@admin.register(Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ('id', 'total_price', 'created_at')
    inlines = [BillItemInline]
    readonly_fields = ('total_price',)
    change_list_template = 'admin/products/billing_changelist.html'
    change_form_template = 'admin/products/billing/change_form.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('generate_bill/', self.admin_site.admin_view(self.create_bill_view),
                 name='products_billing_generate_bill'),
            path('<int:bill_id>/print/', self.admin_site.admin_view(self.print_bill_view),
                 name='products_billing_print'),
        ]
        return custom_urls + urls

    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_print_button'] = True
        return super().change_view(request, object_id, form_url, extra_context)

    def create_bill_view(self, request):
        """Custom view for generating a new bill with multiple products"""
        products = Product.objects.all()
        bills = Billing.objects.order_by('-created_at')[:10]

        BillItemFormSet = formset_factory(BillItemForm, extra=1, min_num=1, validate_min=True)

        if request.method == 'POST':
            formset = BillItemFormSet(request.POST)

            if formset.is_valid():
                # Create a new bill
                bill = Billing.objects.create(total_price=0)

                # Process each item in the formset
                for form in formset:
                    product = form.cleaned_data['product']
                    quantity = form.cleaned_data['quantity']
                    price_type = form.cleaned_data['price_type']

                    # The BillItem.save() method will handle price calculations
                    BillItem.objects.create(
                        bill=bill,
                        product=product,
                        quantity=quantity,
                        price_type=price_type,
                        unit_price=0,  # Will be calculated in save method
                        total_price=0  # Will be calculated in save method
                    )

                self.message_user(request, f'Bill #{bill.id} was successfully generated.')
                return redirect('admin:products_billing_changelist')
            else:
                self.message_user(request, 'Please correct the errors below.', level=messages.ERROR)
        else:
            formset = BillItemFormSet()

        context = {
            'formset': formset,
            'products': products,
            'bills': bills,
            'opts': self.model._meta,
            'title': 'Generate Bill'
        }
        return render(request, 'admin/products/create_bill.html', context)

    def print_bill_view(self, request, bill_id):
        """Custom view for printing a single bill with company branding"""
        bill = get_object_or_404(Billing, id=bill_id)
        bill_items = bill.billitem_set.all()

        context = {
            'bill': bill,
            'bill_items': bill_items,
            'company_name': 'AppleMate',
            "company_logo_url": "/static/images/logo.png",
            'company_address': 'Apple Mate, Vakathanam P.O Kottayam Pin: 686538',
            'company_phone': '9747903970',
            'company_email': 'applemate@gmail.com',
            'company_website': 'www.applemate.com',
            'bill_date': bill.created_at.strftime('%B %d, %Y'),
            'bill_number': f'INV-{bill.id:06d}',
        }
        return render(request, 'admin/products/print_bill.html', context)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'normal_price')  # Fields to display in the list view
    search_fields = ('name', 'category__name')  # Add search functionality
    list_filter = ('category',)  # Add filters for categories

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Display category names

