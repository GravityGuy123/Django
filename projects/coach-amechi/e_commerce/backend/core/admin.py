from django.contrib import admin

from core.models import Cart, CustomUser, Order, Payment, Product, ShippingAddress, Vendor

# Register your models here.
admin.site.register([Cart, CustomUser, Order, Payment, Product, ShippingAddress, Vendor])