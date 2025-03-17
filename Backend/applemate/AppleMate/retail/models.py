from django.db import models
from django.contrib.auth.models import User

# ✅ Retail Seller Profile (Linked to User)
class RetailSellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="retailsellerprofile")
    store_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=100, null=True, blank=True)  # Remove unique constraint to avoid conflicts with User.email
    owner_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    store_address = models.CharField(max_length=255)
    is_approved = models.BooleanField(default=False)  # Admin approval

    def __str__(self):
        return f"{self.store_name} ({'Approved' if self.is_approved else 'Pending'})"

    def save(self, *args, **kwargs):
        # Ensure email matches user email
        if self.user and not self.email:
            self.email = self.user.email
        super().save(*args, **kwargs)

# ✅ Product Model
class Product(models.Model):
    name = models.CharField(max_length=255)
    normal_price = models.DecimalField(max_digits=10, decimal_places=2)
    retail_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

# ✅ Order Model
class Order(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Delivered", "Delivered"),
    ]

    PAYMENT_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("online", "Online Payment"),
    ]

    seller = models.ForeignKey(RetailSellerProfile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    order_date = models.DateTimeField(auto_now_add=True)

    # New fields for shipping details
    shipping_name = models.CharField(max_length=100)
    shipping_address = models.TextField(max_length=200, default="")
    shipping_phone = models.CharField(max_length=15,default="")
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default="cod")

    def __str__(self):
        return f"Order {self.id} - {self.seller.store_name} - {self.product.name}"
