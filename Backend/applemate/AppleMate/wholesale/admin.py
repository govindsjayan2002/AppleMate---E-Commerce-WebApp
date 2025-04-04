from django.contrib import admin
from .models import WholesaleDealerProfile, WholesaleOrder

# ✅ Customize Wholesale Dealer Profile Admin
class WholesaleDealerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "company_name", "contact_person", "phone_number", "is_approved", "user_type")
    list_filter = ("is_approved", "user_type")
    search_fields = ("user__username", "company_name", "contact_person", "phone_number")
    actions = ["approve_wholesale_dealer"]

    def approve_wholesale_dealer(self, request, queryset):
        queryset.update(is_approved=True)
    approve_wholesale_dealer.short_description = "Approve selected wholesale dealers"

# ✅ Customize Wholesale Order Admin
class WholesaleOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "dealer", "product", "quantity", "total_price", "status", "order_date")
    list_filter = ("status", "order_date")
    search_fields = ("dealer__user__username", "product__name")
    actions = ["mark_as_delivered"]

    def mark_as_delivered(self, request, queryset):
        queryset.update(status="Delivered")
    mark_as_delivered.short_description = "Mark selected orders as Delivered"

# ✅ Register the Models in Admin Panel
admin.site.register(WholesaleDealerProfile, WholesaleDealerProfileAdmin)
admin.site.register(WholesaleOrder, WholesaleOrderAdmin)

