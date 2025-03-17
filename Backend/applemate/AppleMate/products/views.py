from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product
from .serializers import ProductSerializer

class ProductListView(APIView):
    permission_classes = [AllowAny]  # Allows both authenticated & unauthenticated users

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        data = serializer.data

        # Modify data based on authentication
        if not request.user.is_authenticated:
            # Show only normal price for unauthenticated users
            for product in data:
                product.pop("retail_price", None)
                product.pop("wholesale_price", None)

        return Response({"products": data})  # Return data inside 'products' key

