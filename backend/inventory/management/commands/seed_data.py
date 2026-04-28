from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from inventory.models import Category, Supplier, Product, ProductDetails, StockMovement


class Command(BaseCommand):
    help = "Créer des données de démonstration"

    def handle(self, *args, **kwargs):

        # SUPERUSER
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@example.com",
                password="admin1234"
            )

        # CATEGORIES
        cat1, _ = Category.objects.get_or_create(name="Électronique")
        cat2, _ = Category.objects.get_or_create(name="Bureautique")

        # SUPPLIERS
        sup1, _ = Supplier.objects.get_or_create(
            name="Tech Supply", email="contact@techsupply.test"
        )
        sup2, _ = Supplier.objects.get_or_create(
            name="Office Pro", email="sales@officepro.test"
        )
        sup3, _ = Supplier.objects.get_or_create(
            name="Global IT", email="info@globalit.test"
        )

        # PRODUCTS
        products_data = [
            {
                "sku": "KB-001",
                "name": "Clavier mécanique",
                "category": cat1,
                "quantity": 12,
                "minimum_stock": 5,
                "price": 49.90,
                "suppliers": [sup1, sup2],
                "location": "A1-03",
            },
            {
                "sku": "MS-002",
                "name": "Souris sans fil",
                "category": cat1,
                "quantity": 8,
                "minimum_stock": 3,
                "price": 25.00,
                "suppliers": [sup1],
                "location": "A1-05",
            },
            {
                "sku": "CH-003",
                "name": "Chaise bureau",
                "category": cat2,
                "quantity": 3,
                "minimum_stock": 5,  # low stock
                "price": 120.00,
                "suppliers": [sup2, sup3],
                "location": "B2-01",
            },
        ]

        for data in products_data:
            product, created = Product.objects.get_or_create(
                sku=data["sku"],
                defaults={
                    "name": data["name"],
                    "description": "Produit de démonstration",
                    "quantity": data["quantity"],
                    "minimum_stock": data["minimum_stock"],
                    "price": data["price"],
                    "category": data["category"],
                },
            )

            product.suppliers.set(data["suppliers"])

            ProductDetails.objects.get_or_create(
                product=product,
                defaults={
                    "storage_location": data["location"],
                    "barcode": f"CODE-{data['sku']}",
                },
            )

            # MOVEMENTS
            if product.movements.count() == 0:
                StockMovement.objects.create(
                    product=product,
                    movement_type="IN",
                    quantity=data["quantity"],
                    reason="Stock initial"
                )

        self.stdout.write(self.style.SUCCESS("Données de démonstration créées ✔"))