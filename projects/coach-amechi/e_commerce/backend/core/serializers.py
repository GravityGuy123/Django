from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

from core.models import (
    Cart,
    CartItem,
    Order,
    OrderItem,
    Product,
    ShippingAddress,
    Vendor,
)

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="email already taken")
        ],
    )
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        password1 = attrs["password"]
        password2 = attrs.get("confirm_password")

        if len(password1) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long"
            )

        if password1 != password2:
            raise serializers.ValidationError("Password mismatch")

        if not any(char.isupper() for char in password1):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter"
            )

        # Check for lowercase letter
        if not any(char.islower() for char in password1):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter"
            )

        # Check for digit
        if not any(char.isdigit() for char in password1):
            raise serializers.ValidationError(
                "Password must contain at least one number"
            )

        # Check for special character
        special_characters = r"!@#$%^&*()-_=+[]{}|;:',.<>?/`~"
        if not any(char in special_characters for char in password1):
            raise serializers.ValidationError(
                "Password must contain at least one special character"
            )

        attrs.pop("confirm_password", None)
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        # fields = "__all__"
        exclude = ["user"]
        read_only_fields = [
            "id",
            "is_vendor",
            "is_activated",
            "user",
            "created_at",
            "updated_at",
            "total_sales_ever",
        ]

    def validate_avatar(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image size cannot exceed 5MB")

        # Check file extension
        if not value.name.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
            raise serializers.ValidationError(
                "Only PNG, JPG, JPEG, and GIF files are allowed"
            )
        return value


class ProductSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = [
            "id",
            "vendor",
            "created_at",
            "updated_at",
            "is_on_flash_sales",
            "old_price",
        ]

    def validate_stock(self, value):
        if value < 1:
            raise serializers.ValidationError("Stock count cannot be less than one")
        return value


class ShippingAddressSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = ShippingAddress
        # fields = "__all__"
        exclude = ["user"]
        read_only_fields = ["id", "user"]


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(
        source="product.current_price", max_digits=18, decimal_places=2, read_only=True
    )
    product_thumbnail = serializers.ImageField(
        source="product.thumbnail", read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_thumbnail",
            "quantity",
            "sub_total",
            "added_at",
        ]
        read_only_fields = ["id", "user", "added_at", "sub_total"]


class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Cart
        fields = ["id", "user", "cart_items", "total_price", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at", "total_price"]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_thumbnail = serializers.ImageField(
        source="product.thumbnail", read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_thumbnail",
            "quantity",
            "price_per_item",
            "sub_total",
        ]
        read_only_fields = ["id", "sub_total"]


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    shipp_addr_details = ShippingAddressSerializer(source="shipp_addr", read_only=True)
    total_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "shipp_addr",
            "shipp_addr_details",
            "status",
            "order_items",
            "amount",
            "payment_refrence",
            "transaction_refrence",
            "created_at",
            "updated_at",
            "total_amount",
        ]
        read_only_fields = [
            "id",
            "user",
            "amount",
            "created_at",
            "updated_at",
            "total_amount",
        ]
