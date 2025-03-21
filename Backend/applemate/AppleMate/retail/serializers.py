from rest_framework import serializers
from django.contrib.auth.models import User
from .models import RetailSellerProfile, Product, Order

# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # Ensure password is hashed

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)  # ✅ Creates user with hashed password

# ✅ Retail Seller Profile Serializer
class RetailSellerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = RetailSellerProfile
        fields = ["user", "email", "store_name", "owner_name", "phone_number", "store_address", "is_approved"]
        extra_kwargs = {"is_approved": {"read_only": True}}

    def create(self, validated_data):
        user = self.context["user"]
        validated_data.pop("user", None)  # Ensure 'user' is not in validated_data
        return RetailSellerProfile.objects.create(user=user, **validated_data)



# ✅ Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# ✅ Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    buyer = RetailSellerProfileSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
