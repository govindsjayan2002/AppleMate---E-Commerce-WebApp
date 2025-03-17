from django.urls import path
from .views import (
    StaffProfileListCreateView, StaffProfileDetailView,
    AttendanceListCreateView, StaffAttendanceListView,
    ChangePasswordView
)

urlpatterns = [
    path('staff-profiles/', StaffProfileListCreateView.as_view(), name='staff-list'),  # Admin
    path('profiles/me/', StaffProfileDetailView.as_view(), name='staff-detail'),  # Staff
    path('attendance/', AttendanceListCreateView.as_view(), name='attendance'),  # Admin
    path('attendance/me/', StaffAttendanceListView.as_view(), name='staff-attendance'),  # Staff
    path('staff-change-password/', ChangePasswordView.as_view(), name='change-password'),  # Staff
]
