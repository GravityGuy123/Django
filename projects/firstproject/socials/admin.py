from django.contrib import admin
from .models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "post_image", "created_at", "updated_at")
    search_fields = ("title", "content", "author__username")
    list_filter = ("author", "created_at", "updated_at")

admin.site.register(Post, PostAdmin)
