from django.shortcuts import render
from .models import Post
from django.http import HttpRequest
from django.shortcuts import redirect

# Create your views here.
def index(request):
    """Index Page

    Args:
        request (HttpRequest): _description_
    
    Returns:
        HttpResponse: _description_
    """
    posts = Post.objects.all()
    context = {"posts": posts}
    return render(request, "index.html", context)

def create_post(request: HttpRequest):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        post_image = request.FILES.get("image")  # Handle file upload

        new_post = Post(title=title, content=content, post_image=post_image)
        new_post.save()
        return redirect("/") # Redirect to the index page after creating a post

    return render(request, "create_post.html")