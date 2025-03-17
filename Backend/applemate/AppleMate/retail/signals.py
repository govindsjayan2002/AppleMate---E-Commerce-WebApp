from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import RetailSellerProfile

# ✅ Create a profile only for normal users (Not for Admins or Staff)
@receiver(post_save, sender=User)
def create_retailsellerprofile(sender, instance, created, **kwargs):
    if created and not instance.is_staff and not instance.is_superuser:
        RetailSellerProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_retailsellerprofile(sender, instance, **kwargs):
    if hasattr(instance, 'retailsellerprofile'):  # ✅ Prevents AttributeError
        instance.retailsellerprofile.save()
