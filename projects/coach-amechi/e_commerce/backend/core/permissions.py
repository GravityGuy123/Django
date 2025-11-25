from rest_framework.permissions import BasePermission


class IsVendor(BasePermission):
    """
    Allows access only to vendor users.
    """
    
    message = "User is not a vendor"
    
    def has_permission(self, request, view) -> bool:
        return bool(request.user.is_authenticated and hasattr(request.user, 'is_vendor') and request.user.is_vendor)