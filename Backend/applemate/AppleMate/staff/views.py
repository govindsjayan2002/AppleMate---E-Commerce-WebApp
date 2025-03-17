from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User  # Use the default User model
from .models import Attendance, StaffProfile
from .serializers import AttendanceSerializer, StaffProfileSerializer, PasswordChangeSerializer

# 🔹 Admin: View & Update Staff Details (Only Admin Can Edit Staff Info)
class StaffProfileListCreateView(generics.ListCreateAPIView):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer
    permission_classes = [permissions.IsAdminUser]

# 🔹 Staff: View Personal Details (Each Staff Can Only See Their Own Data)
class StaffProfileDetailView(generics.RetrieveAPIView):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StaffProfile.objects.filter(user=self.request.user)

# 🔹 Admin: Add Attendance Records
class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAdminUser]

# 🔹 Staff: View Their Attendance
class StaffAttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Attendance.objects.filter(staff=self.request.user)

# 🔹 Staff: Change Their Password
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not check_password(old_password, user.password):
                return Response({'error': 'Incorrect old password'}, status=400)

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)  # Keep user logged in
            return Response({'message': 'Password changed successfully'})

        return Response(serializer.errors, status=400)
