from django.contrib import admin
from .models import StaffProfile, Attendance

class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'address', 'salary']  # Fixed 'phone_number' issue
    search_fields = ['user__username', 'phone']

admin.site.register(StaffProfile, StaffProfileAdmin)

class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['staff', 'date', 'present']
    list_filter = ['date', 'present']

admin.site.register(Attendance, AttendanceAdmin)
