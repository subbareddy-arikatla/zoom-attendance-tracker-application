from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Class, Meeting, Attendance
from .serializers import ClassSerializer, MeetingSerializer, AttendanceSerializer, AttendanceCreateSerializer
from accounts.models import User


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def meeting_list_create(request):
    """List all meetings or create a new meeting"""
    if request.method == 'GET':
        meetings = Meeting.objects.all()
        serializer = MeetingSerializer(meetings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = MeetingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def meeting_detail(request, pk):
    """Get, update, or delete a specific meeting"""
    meeting = get_object_or_404(Meeting, pk=pk)
    
    if request.method == 'GET':
        serializer = MeetingSerializer(meeting)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = MeetingSerializer(meeting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        meeting.delete()
        return Response({'message': 'Meeting deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def attendance_list_create(request):
    """List all attendance records or mark attendance"""
    if request.method == 'GET':
        attendances = Attendance.objects.filter(user=request.user)
        serializer = AttendanceSerializer(attendances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        meeting_id = request.data.get('meeting_id')
        status_value = request.data.get('status', 'present')
        
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        attendance, created = Attendance.objects.get_or_create(
            user=request.user,
            meeting=meeting,
            defaults={'status': status_value}
        )
        
        if not created:
            attendance.status = status_value
            attendance.save()
        
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def meeting_attendance_list(request, meeting_id):
    """Get all attendance records for a specific meeting"""
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    attendances = Attendance.objects.filter(meeting=meeting)
    serializer = AttendanceSerializer(attendances, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def class_list_create(request):
    """List all classes or create a new class"""
    if request.method == 'GET':
        classes = Class.objects.all()
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = ClassSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def class_detail(request, pk):
    """Get, update, or delete a specific class"""
    class_obj = get_object_or_404(Class, pk=pk)
    
    if request.method == 'GET':
        serializer = ClassSerializer(class_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = ClassSerializer(class_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        class_obj.delete()
        return Response({'message': 'Class deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_attendance_csv(request):
    """Import attendance from CSV data"""
    meeting_id = request.data.get('meeting_id')
    participants = request.data.get('participants', [])  # List of {email, name, duration, etc.}
    
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    created_count = 0
    updated_count = 0
    errors = []
    
    for participant in participants:
        email = participant.get('email')
        if not email:
            errors.append(f"Missing email for participant: {participant.get('name', 'Unknown')}")
            continue
        
        try:
            user = User.objects.get(email=email)
            duration = participant.get('duration', 0)
            status_value = 'present' if duration >= 20 else 'late'  # 20 minutes threshold
            
            attendance, created = Attendance.objects.get_or_create(
                user=user,
                meeting=meeting,
                defaults={
                    'status': status_value,
                    'notes': f"Imported from CSV. Duration: {duration} minutes"
                }
            )
            
            if not created:
                attendance.status = status_value
                attendance.save()
                updated_count += 1
            else:
                created_count += 1
                
        except User.DoesNotExist:
            errors.append(f"User not found: {email}")
        except Exception as e:
            errors.append(f"Error processing {email}: {str(e)}")
    
    return Response({
        'message': f'Import completed. Created: {created_count}, Updated: {updated_count}',
        'created': created_count,
        'updated': updated_count,
        'errors': errors
    }, status=status.HTTP_200_OK)

