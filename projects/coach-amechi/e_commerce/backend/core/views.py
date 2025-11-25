from uuid import UUID
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from core.models import (
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    Product,
    ShippingAddress,
    Vendor,
)
from core.permissions import IsVendor
from core.serializers import (
    CartItemSerializer,
    OrderSerializer,
    ProductSerializer,
    RegisterSerializer,
    ShippingAddressSerializer,
    VendorSerializer,
)
from django.db import transaction
from core.paystack import Paystack

_paystack = Paystack()


@api_view(["POST"])
def register_user(request: Request) -> Response:
    user_serializer = RegisterSerializer(data=request.data)
    if user_serializer.is_valid(raise_exception=True):
        user_serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def become_vendor(request: Request) -> Response:
    user = request.user
    if user.is_vendor:
        return Response(
            {"details": "User is already a vendor"}, status=status.HTTP_403_FORBIDDEN
        )
    serializer = VendorSerializer(data=request.data)
    if serializer.is_valid():
        user.is_vendor = True
        user.is_customer = False
        # In production activate with OTP or Magic Link via email
        serializer.save(user=user, is_activated=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVendor])
@parser_classes([MultiPartParser, FormParser])
def create_product(request: Request) -> Response:
    try:
        vendor = Vendor.objects.get(user=request.user)
    except Vendor.DoesNotExist:
        return Response({"details": "Only vendors can create products"}, status=400)

    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(vendor=vendor)
        return Response(data=serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsVendor])
@parser_classes([MultiPartParser, FormParser])
def update_product(request: Request, id: UUID):
    try:
        product = Product.objects.get(id=id)
        vendor = Vendor.objects.get(user=request.user)
    except (Product.DoesNotExist, Vendor.DoesNotExist) as e:
        return Response({"details": e}, status=404)

    if product.vendor != vendor:
        return Response({"details": "Unauthorised"}, status=403)

    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)

    return Response(serializer.errors, status=404)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsVendor])
def delete_product(request: Request, id: UUID):
    try:
        product = Product.objects.get(id=id)
        vendor = Vendor.objects.get(user=request.user)
    except (Product.DoesNotExist, Vendor.DoesNotExist):
        return Response({"details": "product not found"}, status=404)

    if product.vendor != vendor:
        return Response({"details": "Unauthorised"}, status=403)

    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def list_products(request: Request) -> Response:
    products = Product.objects.select_related("vendor").all()
    serializer = ProductSerializer(products, many=True, context={"request": request})
    return Response(serializer.data, status=200)


@api_view(["GET"])
def product_details(request: Request, id: UUID) -> Response:
    try:
        product = Product.objects.select_related("vendor").get(id=id)
        psz = ProductSerializer(product, context={"request": request})
        return Response(data=psz.data, status=200)
    except Product.DoesNotExist:
        return Response({"details": "product not found"}, status=404)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def shipping_address(request: Request) -> Response:
    user = request.user
    if request.method == "GET":
        shipping_addresses = ShippingAddress.objects.filter(user=user)
        serializer = ShippingAddressSerializer(shipping_addresses, many=True)
        return Response(serializer.data, status=200)
    elif request.method == "POST":
        serializer = ShippingAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    return Response({"details": "Method not allowed"}, status=405)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def shipping_address_detail(request: Request, id: UUID) -> Response:
    try:
        address = ShippingAddress.objects.get(id=id, user=request.user)
    except ShippingAddress.DoesNotExist:
        return Response({"details": "Address not found"}, status=404)

    if request.method == "GET":
        serializer = ShippingAddressSerializer(address)
        return Response(serializer.data, status=200)
    if request.method == "PUT":
        serializer = ShippingAddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    if request.method == "DELETE":
        address.delete()
        return Response(status=204)

    return Response({"details": "Method not allowed"}, status=405)


# cart items and cart


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def cart_items(request: Request) -> Response:
    user = request.user
    if request.method == "GET":
        cart_items = user.cart.cart_items.all()
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=200)
    elif request.method == "POST":
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    return Response({"details": "Method not allowed"}, status=405)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def cart_item_detail(request: Request, id: UUID) -> Response:
    try:
        cart_item = CartItem.objects.get(id=id, user=request.user)
    except CartItem.DoesNotExist:
        return Response({"details": "Cart item not found"}, status=404)
    if request.method == "GET":
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=200)
    if request.method == "PUT":
        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        serializer.save()
        return Response(serializer.data, status=200)
    if request.method == "DELETE":
        cart_item.delete()
        return Response(status=204)

    return Response({"details": "Method not allowed"}, status=405)


# Order Items
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout(request: Request, ship_addr_Id: UUID) -> Response:
    try:
        cart = Cart.objects.prefetch_related("carts").get(user=request.user)
    except Cart.DoesNotExist:
        return Response({"details": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

    cartitems = cart.cart_items.all()
    if cartitems.count() == 0:
        return Response({"details": "Cart is empty"}, status=status.HTTP_404_NOT_FOUND)

    try:
        shipp_addr = ShippingAddress.objects.get(id=ship_addr_Id, user=request.user)
    except ShippingAddress.DoesNotExist:
        return Response(
            {"details": "Shipping address not found"}, status=status.HTTP_404_NOT_FOUND
        )

    # Create the order and its items inside a transaction
    try:
        with transaction.atomic():
            order = Order.objects.create(
                user=request.user, shipp_addr=shipp_addr, amount=0
            )

            # Create OrderItems from CartItems
            for ci in cartitems:
                product = ci.product
                if product.stock < ci.quantity:
                    # Out of stock; rollback
                    raise ValueError(
                        f"Product '{product.name}' does not have enough stock"
                    )

                order_item = OrderItem.objects.create(
                    product=product,
                    quantity=ci.quantity,
                    price_per_item=product.current_price,
                )

                order.order_items.add(order_item)

                # decrement stock and save product
                product.stock = product.stock - ci.quantity
                product.save()

            # Recalculate and save order amount (Order.save computes amount from items)
            order.save()

            # Clear the cart: delete cart items and clear m2m
            for ci in cartitems:
                # remove from any carts and delete the cart item
                ci.delete()
            cart.cart_items.clear()

    except ValueError as e:
        return Response({"details": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    except Exception:
        return Response(
            {"details": "Could not create order"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_orders(request: Request) -> Response:
    orders = Order.objects.filter(user=request.user).prefetch_related("order_items")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=200)


@api_view(["GET"])
def order_details(request: Request, orderId: UUID) -> Response:
    try:
        order = Order.objects.prefetch_related("order_items").get(
            user=request.user, id=orderId
        )
    except Order.DoesNotExist:
        return Response(
            {"details": "Order not found"}, status=status.HTTP_404_NOT_FOUND
        )
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initialize_payment(request: Request, orderId: UUID) -> Response:
    try:
        order = Order.objects.get(user=request.user, id=orderId)
    except Order.DoesNotExist:
        return Response(
            {"details": "Order not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if order.status != Order.Status.Pending:
        return Response(
            {"details": "Only pending orders can be paid for"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # check whether stock still remains

    # Simulate payment initialization
    response = _paystack.initialize_transaction(
        request.user.email, order.total_amount()
    )
    if not response["status"]:
        return Response(data=response, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    refrence = response["data"]["reference"]
    with transaction.atomic():
        order.status = Order.Status.Processing
        Payment.objects.create(
            order=order,
            amount=order.total_amount,
            paystack_refrence=refrence,
            user=request.user,
        )
        order.save()

    return Response(data=response, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_payment(request: Request, refrence: str):
    if not refrence:
        return Response({"details": "response code not found"}, status=400)

    response = _paystack.verify_transaction(refrence)
    if not response["status"]:
        return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

    try:
        payment = Payment.objects.select_related("payments").get(
            paystack_refrence=refrence, user=request.user
        )
    except Payment.DoesNotExist:
        return Response(
            {"details": f"Payment with the refrence{refrence} does no exist for you"}
        )

    payment.order.status = Order.Status.Successful
    payment.payment_status = Payment.Payment_Status.Successful
    payment.save()

    ## process shipping
    ## notify the customer

    return Response(data=response, status=status.HTTP_200_OK)
