from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import WholesaleDealerProfile, WholesaleOrder
from products.models import Product
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# ✅ Login View
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)

                # Add user_type to the response
                if hasattr(user, 'retailsellerprofile'):
                    user_type = 'retail_seller'
                elif hasattr(user, 'wholesaledealerprofile'):
                    user_type = 'wholesale_dealer'
                else:
                    user_type = 'user'

                return JsonResponse({
                    "message": "Login successful!",
                    "user_type": user_type,
                    "username": user.username
                }, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

# ✅ Logout View
@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"}, status=200)

# ✅ Wholesale Dealer Registration
@csrf_exempt
def register_wholesale_dealer(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            company_name = data.get("company_name")
            contact_person = data.get("contact_person")
            phone_number = data.get("phone_number")
            company_address = data.get("company_address")

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)

            user = User.objects.create_user(username=username, email=email, password=password)
            wholesale_profile = WholesaleDealerProfile.objects.create(
                user=user,
                company_name=company_name,
                contact_person=contact_person,
                phone_number=phone_number,
                company_address=company_address,
                is_approved=False,  # Admin must approve
                user_type="wholesale"
            )

            return JsonResponse({"message": "Registration successful. Awaiting admin approval."}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
            "date_joined": user.date_joined.strftime("%Y-%m-%d"),
        }

        # Check if the user is a Wholesale Dealer
        try:
            wholesale_profile = user.wholesaledealerprofile
            data.update({
                "user_type": "wholesale",
                "company_name": wholesale_profile.company_name,
                "contact_person": wholesale_profile.contact_person,
                "phone_number": wholesale_profile.phone_number,
                "company_address": wholesale_profile.company_address,
            })
        except WholesaleDealerProfile.DoesNotExist:
            pass  # If not a wholesale dealer, move to the next check

        return Response(data)

# ✅ Get Products API (with correct pricing)
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    data = [{"id": p.id, "name": p.name,"wholesale_price": p.wholesale_price} for p in products]

    if not request.user.is_authenticated:
        # Show normal price for unauthenticated users
        for product in data:
            product.pop("wholesale_price", None)
        return Response({"products": data})

    user = request.user
    user_type = "retail"  # Default to retail

    # Check if the user is a wholesale dealer
    if WholesaleDealerProfile.objects.filter(user=user).exists():
        user_type = "wholesale"

    # Modify pricing based on user type
    for product in data:
        if user_type == "wholesale":
            product["price"] = product.pop("wholesale_price")
        else:
            product["price"] = product.pop("retail_price")

    return Response({"products": data, "user_type": user_type})

# ✅ Cart Management (For Wholesale Dealers)
cart_data = {}  # Temporary storage for cart items (Use DB in production)

@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"error": "Login required"}, status=401)

            data = json.loads(request.body)
            product_id = data.get("product_id")
            quantity = int(data.get("quantity"))

            product = Product.objects.get(id=product_id)

            user_cart = cart_data.get(request.user.username, [])
            user_cart.append({"product_id": product.id, "name": product.name, "quantity": quantity})
            cart_data[request.user.username] = user_cart

            return JsonResponse({"message": "Product added to cart"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def view_cart(request):
    if request.user.username in cart_data:
        return JsonResponse({"cart": cart_data[request.user.username]}, status=200)
    return JsonResponse({"cart": []}, status=200)

@csrf_exempt
def clear_cart(request):
    if request.user.username in cart_data:
        cart_data[request.user.username] = []
    return JsonResponse({"message": "Cart cleared"}, status=200)

# ✅ Place Order (For Wholesale Dealers)
@csrf_exempt
def place_wholesale_order(request):
    if request.method == "POST":
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"error": "Login required"}, status=401)

            dealer = WholesaleDealerProfile.objects.get(user=request.user)
            user_cart = cart_data.get(request.user.username, [])

            if not user_cart:
                return JsonResponse({"error": "Cart is empty"}, status=400)

            total_price = sum(Product.objects.get(id=item["product_id"]).wholesale_price * item["quantity"] for item in user_cart)

            order = WholesaleOrder.objects.create(
                dealer=dealer,
                total_price=total_price,
                status="Pending"
            )

            for item in user_cart:
                product = Product.objects.get(id=item["product_id"])
                WholesaleOrder.objects.create(dealer=dealer, product=product, quantity=item["quantity"], total_price=product.wholesale_price * item["quantity"])

            cart_data[request.user.username] = []  # Clear cart after order

            return JsonResponse({"message": "Order placed successfully!", "order_id": order.id}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

# ✅ Get Order History
@csrf_exempt
def get_orders(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required"}, status=401)

    dealer = WholesaleDealerProfile.objects.get(user=request.user)
    orders = WholesaleOrder.objects.filter(dealer=dealer).order_by("-order_date")

    order_list = [
        {
            "id": order.id,
            "product": order.product.name,
            "quantity": order.quantity,
            "total_price": order.total_price,
            "status": order.status,
            "order_date": order.order_date.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for order in orders
    ]

    return JsonResponse({"orders": order_list}, status=200)
