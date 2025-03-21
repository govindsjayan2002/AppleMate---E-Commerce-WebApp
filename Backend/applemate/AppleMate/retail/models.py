from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

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

# Order Model
class Order(models.Model):
    buyer = models.ForeignKey(RetailSellerProfile, on_delete=models.CASCADE)  # ✅ Retail seller is now the buyer
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[("Pending", "Pending"), ("Delivered", "Delivered")])
    shipping_name = models.CharField(max_length=255)
    shipping_address = models.TextField()
    shipping_phone = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=20, choices=[("cod", "Cash on Delivery"), ("online", "Online Payment")])
    order_date = models.DateTimeField(default=now)

    def __str__(self):
        return f"Order {self.id} - {self.buyer.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    item_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity}) - Order {self.order.id}"