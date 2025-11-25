from django.shortcuts import render
from .models import Post

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