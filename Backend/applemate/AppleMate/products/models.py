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
