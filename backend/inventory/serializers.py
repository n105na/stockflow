from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction

from .models import Category, Supplier, Product, ProductDetails, StockMovement


# ======================
# CATEGORY
# ======================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


# ======================
# SUPPLIER
# ======================
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


# ======================
# PRODUCT DETAILS (1-1)
# ======================
class ProductDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetails
        fields = "__all__"

    def validate_storage_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("L'emplacement de stockage est obligatoire.")
        return value


# ======================
# PRODUCT
# ======================
class ProductSerializer(serializers.ModelSerializer):
    # Read-only extra fields
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    details = ProductDetailsSerializer(read_only=True)

    # Suppliers handling
    supplier_ids = serializers.PrimaryKeyRelatedField(
        source="suppliers",
        many=True,
        queryset=Supplier.objects.all(),
        write_only=True,
        required=False
    )
    suppliers = SupplierSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "description",
            "quantity",
            "minimum_stock",
            "price",
            "category",
            "category_name",
            "supplier_ids",
            "suppliers",
            "is_low_stock",
            "details",
            "created_at",
        ]

    # ===== VALIDATION =====
    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("La quantité ne peut pas être négative.")
        return value

    def validate_minimum_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Le stock minimum ne peut pas être négatif.")
        return value


# ======================
# STOCK MOVEMENT (CORE LOGIC)
# ======================
class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            "id",
            "product",
            "product_name",
            "movement_type",
            "quantity",
            "reason",
            "created_at",
        ]

    # ===== VALIDATION =====
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("La quantité doit être strictement positive.")
        return value

    def validate_reason(self, value):
        if not value.strip():
            raise serializers.ValidationError("La raison est obligatoire.")
        return value

    def validate(self, data):
        if data["movement_type"] not in ["IN", "OUT"]:
            raise serializers.ValidationError("Type de mouvement invalide.")
        return data

    # ===== BUSINESS LOGIC =====
    def create(self, validated_data):
        with transaction.atomic():
            product = validated_data["product"]
            movement_type = validated_data["movement_type"]
            quantity = validated_data["quantity"]

            if movement_type == "IN":
                product.quantity += quantity
            else:
                if quantity > product.quantity:
                    raise serializers.ValidationError({
                        "quantity": "Stock insuffisant pour cette sortie."
                    })
                product.quantity -= quantity

            product.save()
            return super().create(validated_data)


# ======================
# USER (for auth display)
# ======================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff"]