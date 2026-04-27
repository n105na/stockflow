from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from inventory.views import (
    CategoryViewSet,
    SupplierViewSet,
    ProductViewSet,
    ProductDetailsViewSet,
    StockMovementViewSet,
    DashboardSummaryView,
    LoginView,
    MeView,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet)
router.register(r"suppliers", SupplierViewSet)
router.register(r"products", ProductViewSet)
router.register(r"product-details", ProductDetailsViewSet)
router.register(r"stock-movements", StockMovementViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),

    # API
    path("api/", include(router.urls)),

    # AUTH
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/me/", MeView.as_view(), name="me"),

    # DASHBOARD
    path("api/dashboard/summary/", DashboardSummaryView.as_view()),
]