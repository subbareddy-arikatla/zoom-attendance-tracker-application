'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClassesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchClasses();
  }, [router]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/attendance/classes/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/attendance/classes/${classId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchClasses(); // Refresh the list
      } else {
        alert('Failed to delete class');
      }
    } catch (err) {
      alert('Network error. Please try again.');
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
          <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">All Classes</h2>
          <Link
            href="/classes/create"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create New Class
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{classItem.subject}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Batch:</strong> {classItem.batch}</p>
                <p><strong>Duration:</strong> {classItem.duration} minutes</p>
                <p><strong>Location:</strong> {classItem.location}</p>
                <p><strong>Created by:</strong> {classItem.created_by_name}</p>
                <p><strong>Total Meetings:</strong> {classItem.total_meetings}</p>
                <p className="text-xs text-gray-500">
                  Created: {new Date(classItem.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(classItem.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {classes.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No classes found. Create your first class to get started.</p>
            <Link
              href="/classes/create"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Class
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

