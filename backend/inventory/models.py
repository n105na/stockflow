from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Supplier(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=0)
    minimum_stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    suppliers = models.ManyToManyField(Supplier, related_name="products", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    @property
    def is_low_stock(self):
        return self.quantity <= self.minimum_stock

    def __str__(self):
        return self.name


class ProductDetails(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="details")
    storage_location = models.CharField(max_length=100)
    barcode = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Détails {self.product.name}"


class StockMovement(models.Model):
    MOVEMENT_TYPES = (
        ("IN", "Entrée"),
        ("OUT", "Sortie"),
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="movements")
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    quantity = models.PositiveIntegerField()
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="stock_movements"
)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["product"])]

    def __str__(self):
        return f"{self.movement_type} {self.quantity} - {self.product.name}"