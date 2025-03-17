from rest_framework import serializers
from django.contrib.auth.models import User  # Use the default User model
from .models import Attendance, StaffProfile

class StaffProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Shows username instead of ID

    class Meta:
        model = StaffProfile
        fields = ['id', 'user', 'phone', 'address', 'salary']

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'staff', 'date', 'present']

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
