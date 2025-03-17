from django.contrib import admin
from .models import RetailSellerProfile, Product, Order

@admin.register(RetailSellerProfile)
class RetailSellerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "store_name", "owner_name", "phone_number", "is_approved")
    list_filter = ("is_approved",)
    search_fields = ("user__username", "store_name", "owner_name")

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "normal_price", "retail_price")
    search_fields = ("name",)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("seller", "product", "quantity", "total_price", "status", "order_date")
    list_filter = ("status",)
