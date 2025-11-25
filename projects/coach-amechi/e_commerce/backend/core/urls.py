from django.urls import path

from core import views

urlpatterns = [
    path("users", views.register_user, name="register_user"),
    path("vendors", views.become_vendor, name="vendor"),
    path("products", views.create_product),
    path("products/update/<uuid:id>", views.update_product),
    path("products/delete/<uuid:id>", views.delete_product),
    path("products/details/<uuid:id>", views.product_details),
    path("products/all", views.list_products),
]
