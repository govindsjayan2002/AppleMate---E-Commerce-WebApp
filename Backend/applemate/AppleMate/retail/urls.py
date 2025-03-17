from django.urls import path
from .views import (
    LoginView, RegisterView, AdminApproveRetailSellerView,
    ProductListView, PlaceOrderView, LogoutView, user_profile,
    ChangePassword, CartView, GetOrdersView
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register-retailer/", RegisterView.as_view(), name="register-retailer"),
    path("admin/approve-retailers/", AdminApproveRetailSellerView.as_view(), name="approve_retailers"),
    path("products/", ProductListView.as_view(), name="product_list"),
    path("place-orders/", PlaceOrderView.as_view(), name="place_order"),
    path("logout/", LogoutView.as_view(), name = "logout"),
    path("RtDetails/", user_profile, name="user-profile"),
    path("changepwd/", ChangePassword, name="change-password"),
    path("orders/", CartView.as_view(), name="order_list"),
    path("orders/list/", GetOrdersView.as_view(), name="update_order_status"),
]
