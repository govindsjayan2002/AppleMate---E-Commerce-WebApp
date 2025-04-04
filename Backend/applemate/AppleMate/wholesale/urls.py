from django.urls import path
from .views import *

urlpatterns = [
    path("ws-login/", login_user, name="login"),
    path("ws-logout/", logout_user, name="logout"),
    path("register-wholesale/", register_wholesale_dealer, name="register_wholesale_dealer"),
    path("ws-get-products/", get_products, name="get_products"),
    path("ws-add-to-cart/", add_to_cart, name="add_to_cart"),
    path("ws-view-cart/", view_cart, name="view_cart"),
    path("ws-clear-cart/", clear_cart, name="clear_cart"),
    path("ws-place-order/", place_wholesale_order, name="place_wholesale_order"),
    path("ws-get-orders/", get_orders, name="get_orders"),
    path("ws-profile/",UserProfileView.as_view(),name="ws-profile"),
]
