# # 1. Initialize a uv package environment
# Method 1 
# uv init backend

# or

# Method 2 
# uv venv .venv


# # 2. Install dependencies (Django, Pillow, and Django REST framework)
# Method 1
# a. uv add django pillow djangorestframework requests

# Method 2
# b. uv pip install django
# pip install Pillow


# # for pip
# pip install Django==1.8.6

# Install Pillow
# Install Pillow
# pip

# # 3. Create a Django project named "config"
# django-admin startproject config .


# # 4. Create a Django app named "coreapp"
# python manage.py startapp coreapp


# # 5. Activate the uv package environment
# source .venv/Scripts/activate


# # 6. Add "coreapp" and "rest_framework" to the INSTALLED_APPS list in config/settings.py


# # 7. Import os module and configure MEDIA_URL and MEDIA_ROOT in zconfig/settings.py


# # 8. Create a superuser for the Django admin interface
# python manage.py createsuperuser


# # 9. Create initial migrations for the database
# python manage.py makemigrations


# # 10. Apply the migrations to the database
# python manage.py migrate


# # 11. Run the Django development server
# python manage.py runserver


# # 12. Run a custom development server
# python manage.py runserver server_ip:port
# e.g.

# python manage.py runserver 127.0.0.1:8003 \
# You can run a custom server when necessary


# # 13. Creating a requirements.txt file
# # a. Activete your virtual environment if not already activated
# source .venv/Scripts/activate

# # b. Generate the requirements.txt file
# pip freeze > requirements.txt

# # c. Verify the contents of requirements.txt
# type requirements.txt  # Windows
# cat requirements.txt   # macOS / Linux

# # d. Update requirements.txt when dependencies is(are) added or removed
# pip freeze > requirements.txt


# # 14. Installing dependencies from requirements.txt after cloning a project
# # a. Create and activate a new virtual environment
# python -m venv .

# # b. Activate the virtual environment
# source .venv/Scripts/activate

# # c. Install dependencies from requirements.txt
# pip install -r requirements.txt


# # 15. Install Decouple
# uv add python-decouple


# # 16. Install Axios
# npm install axios



# other commands.py

# Check Django version
# python -m django --version