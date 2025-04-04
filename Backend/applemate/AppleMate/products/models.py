from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')
    normal_price = models.DecimalField(max_digits=10, decimal_places=2)
    retail_price = models.DecimalField(max_digits=10, decimal_places=2)
    wholesale_price = models.DecimalField(max_digits=10, decimal_places=2)

    def get_price_for_user(self, user):
        if user.user_type == 'retail':
            return self.retail_price
        elif user.user_type == 'wholesale':
            return self.wholesale_price
        return self.normal_price

    def __str__(self):
        return self.name


# Add this to your models.py
class Billing(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Bill #{self.id} - ${self.total_price}"

    def update_total(self):
        """Update the total price based on all bill items"""
        total = sum(item.total_price for item in self.billitem_set.all())
        self.total_price = total
        self.save()


class BillItem(models.Model):
    bill = models.ForeignKey(Billing, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_type = models.CharField(
        max_length=20,
        choices=[
            ('normal', 'Normal'),
            ('retail', 'Retail'),
            ('wholesale', 'Wholesale')
        ],
        default='normal'
    )
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Calculate unit price and total price before saving
        if self.price_type == 'normal':
            self.unit_price = self.product.normal_price
        elif self.price_type == 'retail':
            self.unit_price = self.product.retail_price
        elif self.price_type == 'wholesale':
            self.unit_price = self.product.wholesale_price

        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

        # Update the parent bill's total
        self.bill.update_total()