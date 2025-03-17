from django.contrib import admin
from .models import Product, Category

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'normal_price')  # Fields to display in the list view
    search_fields = ('name', 'category__name')  # Add search functionality
    list_filter = ('category',)  # Add filters for categories

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Display category names
