from django.contrib import admin
from .models import Class, Meeting, Attendance


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['subject', 'batch', 'duration', 'location', 'created_by', 'created_at']
    list_filter = ['created_at', 'subject']
    search_fields = ['subject', 'batch', 'location']


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ['title', 'meeting_date', 'meeting_time', 'created_by', 'created_at']
    list_filter = ['meeting_date', 'created_at']
    search_fields = ['title', 'description']


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'meeting', 'status', 'check_in_time']
    list_filter = ['status', 'check_in_time']
    search_fields = ['user__email', 'meeting__title']

