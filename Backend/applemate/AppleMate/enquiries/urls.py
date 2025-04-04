from django.urls import path
from .views import EnquiryView

urlpatterns = [
    path('submit/', EnquiryView.as_view(), name='submit_enquiry'),
]
