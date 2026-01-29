'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchMeetings();
  }, [router]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Attendance System</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Meetings</h2>
          <div className="flex gap-4">
            <Link
              href="/classes"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Classes
            </Link>
            <Link
              href="/attendance"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Mark Attendance
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{meeting.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{meeting.description}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Date:</strong> {new Date(meeting.meeting_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {meeting.meeting_time}</p>
                <p><strong>Attendees:</strong> {meeting.total_attendees}</p>
              </div>
              <Link
                href={`/attendance?meeting=${meeting.id}`}
                className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center w-full"
              >
                View Attendance
              </Link>
            </div>
          ))}
        </div>

        {meetings.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No meetings found. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

