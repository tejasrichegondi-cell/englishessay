from django.urls import path
from .api_views import RegisterAPIView, LoginAPIView, PredictionAPIView, DatasetAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='api_register'),
    path('login/', LoginAPIView.as_view(), name='api_login'),
    path('predict/', PredictionAPIView.as_view(), name='api_predict'),
    path('dataset/', DatasetAPIView.as_view(), name='api_dataset'),
]
