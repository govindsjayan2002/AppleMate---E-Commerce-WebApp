from django.contrib import admin
from .models import Enquiry

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'email', 'phone', 'message', 'created_at')
    list_filter = ('subject',)
