from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpRequest, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required  # ✅ Import this

from .models import Post
from .forms import PostForm, LoginForm, SignupForm


# =========================
#  Index Page
# =========================
def index(request: HttpRequest) -> HttpResponse:
    """Display all posts."""
    posts = Post.objects.all().order_by("-created_at")
    context = {"posts": posts}
    return render(request, "index.html", context)


# =========================
#  Create Post (using Django Form)
# =========================
@login_required(login_url="login")  # ✅ Only logged-in users can access
def create_with_form(request: HttpRequest) -> HttpResponse:
    """Create a post using Django ModelForm."""
    if request.method == "POST":
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user  # ✅ Assign logged-in user as author
            post.save()
            messages.success(request, "Post created successfully!")
            return redirect("/")
    else:
        form = PostForm()

    return render(request, "post/create_with_form.html", {"form": form})


# =========================
#  Update Post
# =========================
@login_required(login_url="login")
def update_post(request: HttpRequest, id: int) -> HttpResponse:
    """Edit an existing post (only by author)."""
    post = get_object_or_404(Post, id=id)

    # ✅ Restrict editing to the author
    if post.author != request.user:
        messages.error(request, "You are not allowed to edit this post.")
        return redirect("/")

    if request.method == "POST":
        form = PostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, "Post updated successfully!")
            return redirect("/")
    else:
        form = PostForm(instance=post)

    return render(request, "post/update_post.html", {"form": form})


# =========================
#  Delete Post
# =========================
@login_required(login_url="login")
def delete_post(request: HttpRequest, id: int) -> HttpResponse:
    """Delete an existing post (only by author)."""
    post = get_object_or_404(Post, id=id)

    # ✅ Restrict deleting to the author
    if post.author != request.user:
        messages.error(request, "You are not allowed to delete this post.")
        return redirect("/")

    if request.method == "POST":
        post.delete()
        messages.success(request, "Post deleted successfully!")
        return redirect("/")

    return render(request, "post/delete_post.html", {"post": post})


# =========================
#  User Authentication
# =========================
def login_view(request: HttpRequest) -> HttpResponse:
    """User login view."""
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome back, {user.username}!")
                return redirect("/")
            else:
                form.add_error(None, "Invalid username or password")
    else:
        form = LoginForm()

    return render(request, "auth/login.html", {"form": form})


def signup_view(request: HttpRequest) -> HttpResponse:
    """User registration view."""
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]

            User.objects.create_user(username=username, email=email, password=password)
            messages.success(request, "Account created successfully! Please log in.")
            return redirect("login")
    else:
        form = SignupForm()

    return render(request, "auth/signup.html", {"form": form})