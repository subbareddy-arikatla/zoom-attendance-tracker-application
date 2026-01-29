'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AttendancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('meeting');

  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [status, setStatus] = useState('present');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchMeetings();
  }, [router]);

  useEffect(() => {
    if (meetingId && meetings.length > 0) {
      const meeting = meetings.find(m => m.id === parseInt(meetingId));
      if (meeting) {
        setSelectedMeeting(meeting.id);
      }
    }
  }, [meetingId, meetings]);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/attendance/meetings/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMeeting) {
      setMessage('Please select a meeting');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/attendance/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          meeting_id: selectedMeeting,
          status: status,
          notes: notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Attendance marked successfully!');
        setNotes('');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to mark attendance');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Mark Attendance</h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-100 border-l-4 border-green-500 text-green-700' 
              : 'bg-red-100 border-l-4 border-red-500 text-red-700'
          }`}>
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Meeting *
            </label>
            <select
              value={selectedMeeting || ''}
              onChange={(e) => setSelectedMeeting(parseInt(e.target.value))}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Choose a meeting...</option>
              {meetings.map((meeting) => (
                <option key={meeting.id} value={meeting.id}>
                  {meeting.title} - {new Date(meeting.meeting_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
            >
              {loading ? 'Submitting...' : 'Mark Attendance'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

