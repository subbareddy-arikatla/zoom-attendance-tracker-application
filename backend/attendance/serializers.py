from rest_framework import serializers
from .models import Class, Meeting, Attendance
from accounts.serializers import UserSerializer


class ClassSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    total_meetings = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ['id', 'subject', 'batch', 'duration', 'location', 
                  'created_by', 'created_by_name', 'total_meetings', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_total_meetings(self, obj):
        return obj.meetings.count()


class MeetingSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    total_attendees = serializers.SerializerMethodField()
    class_detail = ClassSerializer(source='class_obj', read_only=True)

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'description', 'meeting_date', 'meeting_time', 
                  'class_obj', 'class_detail', 'created_by', 'created_by_name', 
                  'total_attendees', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_total_attendees(self, obj):
        return obj.attendances.filter(status='present').count()


class AttendanceSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    meeting_detail = MeetingSerializer(source='meeting', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'user', 'user_detail', 'meeting', 'meeting_detail', 
                  'status', 'check_in_time', 'notes']
        read_only_fields = ['id', 'check_in_time']

    def validate(self, attrs):
        # Ensure user can only mark their own attendance or admin can mark for others
        if 'user' not in attrs:
            attrs['user'] = self.context['request'].user
        return attrs


class AttendanceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating attendance from CSV import"""
    email = serializers.EmailField(write_only=True)
    meeting_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Attendance
        fields = ['email', 'meeting_id', 'status', 'notes']

