from django.urls import path
from . import views

urlpatterns = [
    path('classes/', views.class_list_create, name='class-list-create'),
    path('classes/<int:pk>/', views.class_detail, name='class-detail'),
    path('meetings/', views.meeting_list_create, name='meeting-list-create'),
    path('meetings/<int:pk>/', views.meeting_detail, name='meeting-detail'),
    path('meetings/<int:meeting_id>/attendances/', views.meeting_attendance_list, name='meeting-attendance-list'),
    path('', views.attendance_list_create, name='attendance-list-create'),
    path('import-csv/', views.import_attendance_csv, name='import-attendance-csv'),
]

