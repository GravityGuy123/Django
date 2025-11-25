from django import forms

class PostForm(forms.Form):
    title = forms.CharField(max_length=100, label="Title")
    content = forms.CharField(widget=forms.Textarea, label="Content")
    image = forms.ImageField(required=False, label="Post_Image")