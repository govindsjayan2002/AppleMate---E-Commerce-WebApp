from django.db import models
from django.contrib.auth.models import User

class WholesaleDealerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    company_address = models.TextField()
    is_approved = models.BooleanField(default=False)  # Admin approval required
    user_type = models.CharField(max_length=20, default="wholesale_dealer")

    def __str__(self):
        return self.company_name

class WholesaleOrder(models.Model):
    dealer = models.ForeignKey(WholesaleDealerProfile, on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Delivered', 'Delivered'),
    ], default='Pending')
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.dealer.company_name}"
