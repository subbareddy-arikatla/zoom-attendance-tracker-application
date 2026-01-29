from django.db import models
from django.conf import settings


class Class(models.Model):
    """Model to store class information"""
    subject = models.CharField(max_length=200)
    batch = models.CharField(max_length=100)
    duration = models.IntegerField(help_text="Duration in minutes")
    location = models.CharField(max_length=200)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_classes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Classes'

    def __str__(self):
        return f"{self.subject} - {self.batch}"


class Meeting(models.Model):
    """Model to store meeting/class information"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    meeting_date = models.DateField()
    meeting_time = models.TimeField()
    class_obj = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True, related_name='meetings')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_meetings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-meeting_date', '-meeting_time']

    def __str__(self):
        return f"{self.title} - {self.meeting_date}"


class Attendance(models.Model):
    """Model to store attendance records"""
    PRESENT = 'present'
    ABSENT = 'absent'
    LATE = 'late'
    
    STATUS_CHOICES = [
        (PRESENT, 'Present'),
        (ABSENT, 'Absent'),
        (LATE, 'Late'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendances')
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='attendances')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PRESENT)
    check_in_time = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['user', 'meeting']
        ordering = ['-check_in_time']

    def __str__(self):
        return f"{self.user.email} - {self.meeting.title} - {self.status}"

