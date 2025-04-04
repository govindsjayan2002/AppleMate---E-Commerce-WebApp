from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, Billing
from .serializers import ProductSerializer
from .forms import BillingForm
from django.shortcuts import render, redirect
from django.http import HttpResponse

class ProductListView(APIView):
    permission_classes = [AllowAny]  # Allow all users to access the product list

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response({"products": serializer.data})  # Send response with correct prices


def generate_bill(request):
    if request.method == 'POST':
        product_id = request.POST.get('product')
        quantity = int(request.POST.get('quantity'))
        price_type = request.POST.get('price_type')
        product = Product.objects.get(id=product_id)
        bill = Billing.objects.create(product=product, quantity=quantity, price_type=price_type)
        return redirect(reverse('admin:product_billing_changelist'))

    products = Product.objects.all()
    bills = Billing.objects.order_by('-created_at')[:10]
    return render(request, 'admin/products/create_bill.html', {'products': products, 'bills': bills})