from django.urls import path
from .views import ProductListView, generate_bill

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('generate_bill/', generate_bill, name='create_bill'),
]
