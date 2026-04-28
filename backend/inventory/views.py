from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from rest_framework import viewsets, filters
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Category, Supplier, Product, ProductDetails, StockMovement
from .serializers import (
    CategorySerializer,
    SupplierSerializer,
    ProductSerializer,
    ProductDetailsSerializer,
    StockMovementSerializer,
    UserSerializer,
)


# ======================
# AUTH
# ======================
class LoginView(TokenObtainPairView):
    permission_classes = []


class MeView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# ======================
# BASE VIEWSET
# ======================
class BaseAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]


# ======================
# CATEGORY
# ======================
class CategoryViewSet(BaseAdminViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


# ======================
# SUPPLIER
# ======================
class SupplierViewSet(BaseAdminViewSet):
    queryset = Supplier.objects.all().order_by("name")
    serializer_class = SupplierSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "email", "phone"]


# ======================
# PRODUCT
# ======================
class ProductViewSet(BaseAdminViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("suppliers", "details").all().order_by("-created_at")
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "sku", "description", "category__name"]


# ======================
# PRODUCT DETAILS
# ======================
class ProductDetailsViewSet(BaseAdminViewSet):
    queryset = ProductDetails.objects.select_related("product").all()
    serializer_class = ProductDetailsSerializer


# ======================
# STOCK MOVEMENT
# ======================
class StockMovementViewSet(BaseAdminViewSet):
    queryset = StockMovement.objects.select_related("product").all()
    serializer_class = StockMovementSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["product__name", "reason"]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ======================
# DASHBOARD
# ======================
class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(quantity__lte=F("minimum_stock")).count()
        total_categories = Category.objects.count()
        total_suppliers = Supplier.objects.count()
        products = Product.objects.all().order_by("-created_at")[:10]
        products_data = ProductSerializer(products, many=True).data
        stock_value_expression = ExpressionWrapper(
            F("quantity") * F("price"),
            output_field=DecimalField(max_digits=14, decimal_places=2),
        )

        total_stock_value = Product.objects.aggregate(total=Sum(stock_value_expression))["total"] or 0

        recent_movements = StockMovement.objects.select_related("product").all()[:5]
        recent_data = StockMovementSerializer(recent_movements, many=True).data

        return Response({
            "total_products": total_products,
            "low_stock_products": low_stock_products,
            "total_categories": total_categories,
            "total_suppliers": total_suppliers,
            "total_stock_value": total_stock_value,
            "recent_movements": recent_data,
            "products": products_data,
        })