from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import RetailSellerProfile, Product, Order, OrderItem
from .serializers import RetailSellerProfileSerializer, ProductSerializer, OrderSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.hashers import make_password,check_password
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging, json
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View


logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.debug(f"Received data: {request.data}")

        user_type = request.data.get("user_type")
        username = request.data.get("username")
        email = request.data.get("email")

        if not user_type:
            return Response({"error": "User type is required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Create user and hash password
            password = serializer.validated_data.pop("password")
            user = serializer.save(password=make_password(password))  # Hash password before saving

            if user_type == "retail_seller":
                # Ensure all required fields exist
                missing_fields = [
                    field for field in ["store_name", "owner_name", "phone_number", "store_address"]
                    if not request.data.get(field)
                ]
                if missing_fields:
                    user.delete()  # Prevent orphaned users
                    return Response({"error": f"Missing fields: {', '.join(missing_fields)}"},
                                    status=status.HTTP_400_BAD_REQUEST)

                try:
                    # Create the retail seller profile
                    RetailSellerProfile.objects.create(
                        user=user,
                        store_name=request.data["store_name"],
                        owner_name=request.data["owner_name"],
                        phone_number=request.data["phone_number"],
                        store_address=request.data["store_address"],
                        email=user.email,
                        is_approved=False
                    )
                    return Response({"message": "Retail seller registered. Awaiting admin approval."},
                                    status=status.HTTP_201_CREATED)
                except Exception as e:
                    user.delete()  # Rollback user creation if profile fails
                    logger.error(f"Error creating RetailSellerProfile: {str(e)}")
                    return Response({"error": f"Failed to create profile: {str(e)}"},
                                    status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "User registered successfully. Awaiting admin approval."},
                            status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Admin Approves/Rjects Retail Sellers
class AdminApproveRetailSellerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        sellers = RetailSellerProfile.objects.filter(is_approved=False)
        serializer = RetailSellerProfileSerializer(sellers, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        seller_id = request.data.get("seller_id")
        approve = request.data.get("approve")  # True for approve, False for reject

        try:
            seller = RetailSellerProfile.objects.get(id=seller_id)
            seller.is_approved = approve
            seller.save()
            return Response({'message': 'Seller approval updated successfully'}, status=status.HTTP_200_OK)
        except RetailSellerProfile.DoesNotExist:
            return Response({'error': 'Seller not found'}, status=status.HTTP_404_NOT_FOUND)


# ✅ Login for Users (Retail Sellers, Staff, Admins)
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Return CSRF token for the frontend
        token = get_token(request)
        return Response({'csrfToken': token})

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "").strip()

        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_staff or user.is_superuser:
                login(request, user)
                return Response({
                    "message": "Admin login successful",
                    "role": "admin",
                    "username": user.username
                }, status=status.HTTP_200_OK)

            # Check retail seller approval
            seller_profile = getattr(user, 'retailsellerprofile', None)
            if seller_profile and not seller_profile.is_approved:
                return Response({
                    "error": "Your account is pending admin approval."
                }, status=status.HTTP_403_FORBIDDEN)

            login(request, user)
            return Response({
                "message": "Login successful",
                "role": "user",
                "username": user.username,
            }, status=status.HTTP_200_OK)

        return Response({
            "error": "Invalid username or password."
        }, status=status.HTTP_400_BAD_REQUEST)

#User logout
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        logout(request)
        return Response({"message": "Successfully logged out"}, status = status.HTTP_200_OK)


# ✅ Product Listing (Retail Sellers See Retail Prices, Others See Normal Price)
class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        data = serializer.data

        # ✅ If user is authenticated and a retail seller, show retail price
        seller_profile = getattr(request.user, 'retailsellerprofile', None)
        if request.user.is_authenticated and seller_profile and seller_profile.is_approved:
            return Response(data)  # Retail sellers see full data

        # ✅ Remove retail price for unauthenticated users
        for product in data:
            product.pop("retail_price", None)

        return Response(data)


# ✅ Place Order (Only Approved Retail Sellers)
class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            buyer = get_object_or_404(RetailSellerProfile, user=request.user)
            shipping_name = data.get("shipping_name")
            shipping_address = data.get("shipping_address")
            shipping_phone = data.get("shipping_phone")
            payment_method = data.get("payment_method")
            cart_items = data.get("cart_items", [])  # Ensure it's a list

            if not cart_items:
                return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

            total_price = 0
            order_items = []

            for item in cart_items:
                product_id = item.get("product_id")  # Ensure product_id is fetched correctly
                quantity = item.get("quantity")

                if not product_id or not quantity:
                    return Response({"error": "Invalid cart item data"}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    logger.error(f"Product with ID {product_id} not found.")
                    return Response({"error": f"Product with ID {product_id} not found."},
                                    status=status.HTTP_400_BAD_REQUEST)

                item_total = product.retail_price * quantity
                total_price += item_total
                order_items.append({
                    "product": product,
                    "quantity": quantity,
                    "item_price": item_total
                })

            # Create Order
            order = Order.objects.create(
                buyer=buyer,
                total_price=total_price,
                status="Pending",
                shipping_name=shipping_name,
                shipping_address=shipping_address,
                shipping_phone=shipping_phone,
                payment_method=payment_method,
            )

            # Create Order Items
            OrderItem.objects.bulk_create([
                OrderItem(
                    order=order,
                    product=item["product"],
                    quantity=item["quantity"],
                    item_price=item["item_price"]
                ) for item in order_items
            ])

            return Response({"message": "Order placed successfully!"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error placing order: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#User details fetching
@login_required
def user_profile(request):
    user = request.user
    try:
        retail_profile = RetailSellerProfile.objects.get(user=user)

        user_data = {
            "username": user.username,
            "email": user.email,
            "store_name": retail_profile.store_name,
            "phone_number": retail_profile.phone_number,
            "store_address": retail_profile.store_address,
            "date_joined": user.date_joined,
        }
    except RetailSellerProfile.DoesNotExist:
        user_data = {
            "username" : user.username,
            "email": user.email,
            "date_joined": user.date_joined,
        }
    return JsonResponse(user_data)

#Change Password
@login_required
@csrf_exempt
def ChangePassword(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            new_password = data.get("new_password")
            confirm_password = data.get("confirm_password")

            if not new_password or not confirm_password:
                return  JsonResponse({"error": "Passwords do not match"}, status=400)

            if new_password != confirm_password:
                return JsonResponse({"error": "Password do not match"}, status=400)

            user = request.user
            user.set_password(new_password)
            user.save()

            update_session_auth_hash(request, user)

            return JsonResponse({"message": "Password updated successfully"}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid data format"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

#CartView
@method_decorator(csrf_exempt, name='dispatch')
class CartView(View):
    def dispatch(self, request, *args, **kwargs):
        """
        Dispatch method to handle different cart operations based on request method and parameters
        """
        # Check authentication
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required"}, status=401)

        # Get seller profile
        try:
            self.seller = RetailSellerProfile.objects.get(user=request.user)
        except RetailSellerProfile.DoesNotExist:
            return JsonResponse({"error": "Seller profile not found"}, status=404)

        # Initialize cart in session if needed
        if 'cart' not in request.session:
            request.session['cart'] = {}

        # Handle different operations based on request parameters
        operation = request.GET.get('operation')

        if operation == 'add':
            return self.add_to_cart(request)
        elif operation == 'remove':
            return self.remove_from_cart(request)
        elif operation == 'update':
            return self.update_cart(request)
        elif operation == 'checkout':
            return self.checkout(request)
        else:
            return self.get_cart(request)

    def get_cart(self, request):
        """Get the current cart contents"""
        cart = request.session.get('cart', {})
        cart_items = []
        total = 0

        for product_id, quantity in cart.items():
            try:
                product = Product.objects.get(id=int(product_id))
                price = float(product.retail_price)
                item_total = price * quantity
                cart_items.append({
                    'id': product.id,
                    'name': product.name,
                    'price': price,
                    'quantity': quantity,
                    'total': item_total
                })
                total += item_total
            except Product.DoesNotExist:
                pass

        return JsonResponse({
            "cart_items": cart_items,
            "total": total
        })

    def add_to_cart(self, request):
        """Add a product to the cart"""
        data = json.loads(request.body) if request.body else {}
        product_id = data.get('product_id') or request.GET.get('product_id')
        quantity = int(data.get('quantity', 1) or request.GET.get('quantity', 1))

        if not product_id:
            return JsonResponse({"error": "Product ID is required"}, status=400)

        try:
            product = Product.objects.get(id=product_id)

            # Update cart in session
            cart = request.session.get('cart', {})
            cart[str(product_id)] = quantity
            request.session['cart'] = cart
            request.session.modified = True

            return JsonResponse({"success": True, "message": f"{product.name} added to cart"})
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)

    def remove_from_cart(self, request):
        """Remove a product from the cart"""
        data = json.loads(request.body) if request.body else {}
        product_id = data.get('product_id') or request.GET.get('product_id')

        if not product_id:
            return JsonResponse({"error": "Product ID is required"}, status=400)

        # Update cart in session
        cart = request.session.get('cart', {})
        if str(product_id) in cart:
            del cart[str(product_id)]
            request.session['cart'] = cart
            request.session.modified = True
            return JsonResponse({"success": True, "message": "Item removed from cart"})
        else:
            return JsonResponse({"error": "Product not in cart"}, status=404)

    def update_cart(self, request):
        """Update product quantity in cart"""
        data = json.loads(request.body) if request.body else {}
        product_id = data.get('product_id') or request.GET.get('product_id')
        quantity = int(data.get('quantity', 0) or request.GET.get('quantity', 0))

        if not product_id:
            return JsonResponse({"error": "Product ID is required"}, status=400)

        # Remove if quantity is 0
        if quantity <= 0:
            return self.remove_from_cart(request)

        # Update cart in session
        cart = request.session.get('cart', {})
        cart[str(product_id)] = quantity
        request.session['cart'] = cart
        request.session.modified = True

        return JsonResponse({"success": True, "message": "Cart updated"})

    def checkout(self, request):
        """Convert cart items to orders"""
        cart = request.session.get('cart', {})

        if not cart:
            return JsonResponse({"error": "Cart is empty"}, status=400)

        orders = []
        for product_id, quantity in cart.items():
            try:
                product = Product.objects.get(id=int(product_id))
                order = Order.objects.create(
                    seller=self.seller,
                    product=product,
                    quantity=quantity,
                    total_price=product.retail_price * quantity,
                    status="Pending"
                )
                orders.append({
                    'id': order.id,
                    'product': product.name,
                    'quantity': quantity,
                    'total_price': float(order.total_price)
                })
            except Product.DoesNotExist:
                continue

        # Clear the cart
        request.session['cart'] = {}
        request.session.modified = True

        return JsonResponse({
            "success": True,
            "message": "Orders created successfully",
            "orders": orders
        })


# Get orders
class GetOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            seller_profile = RetailSellerProfile.objects.get(user=request.user)
            if not seller_profile.is_approved:
                return Response({'error': 'You are not an approved retail seller'}, status=status.HTTP_403_FORBIDDEN)
        except RetailSellerProfile.DoesNotExist:
            return Response({'error': 'Retail seller profile not found'}, status=status.HTTP_404_NOT_FOUND)

        orders = Order.objects.filter(buyer=seller_profile).order_by('-order_date')

        orders_data = []
        for order in orders:
            # Get all items for this order
            order_items = order.items.all()
            items_data = []

            for item in order_items:
                item_data = {
                    'product_name': item.product.name,
                    'product_id': item.product.id,
                    'quantity': item.quantity,
                    'item_price': float(item.item_price)
                }
                items_data.append(item_data)

            order_data = {
                'id': order.id,
                'items': items_data,
                'total_price': float(order.total_price),
                'status': order.status,
                'order_date': order.order_date,
                'shipping_name': order.shipping_name,
                'shipping_address': order.shipping_address,
                'shipping_phone': order.shipping_phone,
                'payment_method': order.payment_method
            }
            orders_data.append(order_data)

        return Response(orders_data)