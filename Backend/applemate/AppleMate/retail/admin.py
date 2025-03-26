from django.contrib import admin
from django.urls import path, reverse
from django.http import HttpResponse
from django.utils.html import format_html
import csv
from .models import RetailSellerProfile, Product, Order, OrderItem

@admin.action(description="Download Retail Orders Report")
def download_retail_orders_report(modeladmin, request, queryset):
    """Admin action to download selected retail orders as CSV."""
    filename = "retail_orders_report.csv"
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'

    writer = csv.writer(response)
    writer.writerow(["Order ID", "Buyer", "Product", "Quantity", "Item Price", "Total Price", "Order Date", "Status"])

    for order in queryset:
        for item in order.items.all():  # ✅ Corrected - use `order.items.all()` instead of `OrderItem.objects.filter(order=order)`
            writer.writerow([
                order.id,
                order.buyer.user.username,
                item.product.name,
                item.quantity,
                item.item_price,
                order.total_price,
                order.order_date.strftime("%Y-%m-%d %H:%M:%S"),
                order.status
            ])

    return response

@admin.register(RetailSellerProfile)
class RetailSellerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "store_name", "owner_name", "phone_number", "is_approved")
    list_filter = ("is_approved",)
    search_fields = ("user__username", "store_name", "owner_name")

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "normal_price", "retail_price")
    search_fields = ("name",)

    def changelist_view(self, request, extra_context=None):
        """Custom admin view to add a button outside the product table."""
        if extra_context is None:
            extra_context = {}

        # Add sales chart button
        extra_context["sales_chart_url"] = reverse("sales_chart")
        return super().changelist_view(request, extra_context=extra_context)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ["id", "buyer", "total_price", "status", "order_date"]
    list_filter = ["status", "order_date"]
    actions = [download_retail_orders_report]
