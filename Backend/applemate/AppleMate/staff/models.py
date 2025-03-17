from django.db import models
from django.contrib.auth.models import User  # Use the default User model

class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Reference default User model
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username} - Staff Profile"

class Attendance(models.Model):
    staff = models.ForeignKey(User, on_delete=models.CASCADE)  # Reference default User model
    date = models.DateField(auto_now_add=True)
    present = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.staff.username} - {self.date}"
