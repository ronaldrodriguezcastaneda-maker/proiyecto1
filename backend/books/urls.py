from django.urls import path
from . import views

urlpatterns = [
    # Esta ruta servirá para el GET (listar) y el POST (crear)
    path('api/books/', views.book_list, name='book_list'),
    
    # Esta ruta servirá para el DELETE (borrar un libro en específico)
    path('api/books/<int:book_id>/', views.book_detail, name='book_detail'),
]