from django.contrib import admin
from .models import Category, Supplier, Product, ProductDetails, StockMovement


# ======================
# CATEGORY
# ======================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]
    search_fields = ["name"]


# ======================
# SUPPLIER
# ======================
@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "email", "phone"]
    search_fields = ["name", "email"]


# ======================
# PRODUCT
# ======================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "sku", "quantity", "minimum_stock", "category", "is_low_stock"]
    list_filter = ["category"]
    search_fields = ["name", "sku"]
    filter_horizontal = ["suppliers"]


# ======================
# PRODUCT DETAILS
# ======================
@admin.register(ProductDetails)
class ProductDetailsAdmin(admin.ModelAdmin):
    list_display = ["product", "storage_location", "barcode"]


# ======================
# STOCK MOVEMENT
# ======================
@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ["id", "product", "movement_type", "quantity", "created_by", "created_at"]
    list_filter = ["movement_type"]
    search_fields = ["product__name", "reason"]