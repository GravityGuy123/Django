from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # =========================
    #  Public Routes
    # =========================
    path("", views.index, name="index"),

    # =========================
    #  Post Management (require login)
    # =========================
    path("create/", views.create_with_form, name="create_post"),
    path("update_post/<int:id>/", views.update_post, name="update_post"),
    path("delete_post/<int:id>/", views.delete_post, name="delete_post"),

    # =========================
    #  Authentication
    # =========================
    path("auth/login/", views.login_view, name="login"),
    path("auth/signup/", views.signup_view, name="signup"),
]

# ✅ Serve media files (development only)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)