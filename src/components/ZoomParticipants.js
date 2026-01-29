// 'use client';

// import { useState } from 'react';

// export default function ZoomParticipants() {
//     const [meetingId, setMeetingId] = useState('');
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const fetchParticipants = async (e) => {
//         e?.preventDefault();

//         if (!meetingId.trim()) {
//             setError('Please enter a meeting ID');
//             return;
//         }

//         setLoading(true);
//         setError(null);
//         setData(null);

//         try {
//             const response = await fetch(
//                 `/api/zoom/participants?meetingId=${encodeURIComponent(meetingId)}`
//             );
//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.error || 'Failed to fetch data');
//             }

//             setData(result);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const exportToCSV = () => {
//         if (!data?.participants) return;

//         const headers = ['Name', 'Email', 'Join Time', 'Leave Time', 'Duration (minutes)', 'Attentiveness Score'];
//         const rows = data.participants.map(p => [
//             `"${p.name}"`,
//             `"${p.email}"`,
//             `"${new Date(p.joinTime).toLocaleString()}"`,
//             `"${new Date(p.leaveTime).toLocaleString()}"`,
//             p.duration,
//             p.attentiveness_score,
//         ]);

//         const csvContent = [
//             headers.join(','),
//             ...rows.map(row => row.join(','))
//         ].join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         const url = URL.createObjectURL(blob);
//         link.setAttribute('href', url);
//         link.setAttribute('download', `zoom-attendance-${data.meeting.id}.csv`);
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const exportToJSON = () => {
//         if (!data) return;

//         const jsonContent = JSON.stringify(data, null, 2);
//         const blob = new Blob([jsonContent], { type: 'application/json' });
//         const link = document.createElement('a');
//         const url = URL.createObjectURL(blob);
//         link.setAttribute('href', url);
//         link.setAttribute('download', `zoom-attendance-${data.meeting.id}.json`);
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-gray-800 mb-2">
//                         🎯 Zoom Attendance Tracker
//                     </h1>
//                     <p className="text-gray-600">Track meeting participation and generate attendance reports</p>
//                 </div>

//                 {/* Search Form */}
//                 <form onSubmit={fetchParticipants} className="mb-8">
//                     <div className="bg-white rounded-lg shadow-md p-6">
//                         <div className="flex gap-4">
//                             <input
//                                 type="text"
//                                 placeholder="Enter Meeting ID (e.g., 821 2571 0576)"
//                                 value={meetingId}
//                                 onChange={(e) => setMeetingId(e.target.value)}
//                                 className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                             />
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
//                             >
//                                 {loading ? '⏳ Loading...' : '🔍 Search'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>

//                 {/* Error Message */}
//                 {error && (
//                     <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
//                         <p className="font-bold">❌ Error</p>
//                         <p>{error}</p>
//                     </div>
//                 )}

//                 {/* Results */}
//                 {data && (
//                     <div className="space-y-6">
//                         {/* Meeting Summary */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                                         {data.meeting.topic}
//                                     </h2>
//                                     <p className="text-gray-600">
//                                         <strong>Meeting ID:</strong> {data.meeting.id}
//                                     </p>
//                                     <p className="text-gray-600">
//                                         <strong>Start Time:</strong> {new Date(data.meeting.startTime).toLocaleString()}
//                                     </p>
//                                     <p className="text-gray-600">
//                                         <strong>Duration:</strong> {data.meeting.duration} minutes
//                                     </p>
//                                 </div>

//                                 <div className="grid grid-cols-3 gap-4">
//                                     <div className="bg-blue-50 p-4 rounded-lg">
//                                         <p className="text-gray-600 text-sm">Total Participants</p>
//                                         <p className="text-3xl font-bold text-blue-600">
//                                             {data.attendance.totalParticipants}
//                                         </p>
//                                     </div>
//                                     <div className="bg-green-50 p-4 rounded-lg">
//                                         <p className="text-gray-600 text-sm">Total Duration</p>
//                                         <p className="text-3xl font-bold text-green-600">
//                                             {data.attendance.totalDuration}m
//                                         </p>
//                                     </div>
//                                     <div className="bg-purple-50 p-4 rounded-lg">
//                                         <p className="text-gray-600 text-sm">Avg Duration</p>
//                                         <p className="text-3xl font-bold text-purple-600">
//                                             {data.attendance.averageDuration}m
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Export Buttons */}
//                         <div className="flex gap-4">
//                             <button
//                                 onClick={exportToCSV}
//                                 className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
//                             >
//                                 📥 Export as CSV
//                             </button>
//                             <button
//                                 onClick={exportToJSON}
//                                 className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition"
//                             >
//                                 📥 Export as JSON
//                             </button>
//                         </div>

//                         {/* Participants Table */}
//                         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                             <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
//                                 <h3 className="text-xl font-bold text-white">
//                                     📋 Participants ({data.participants.length})
//                                 </h3>
//                             </div>

//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead>
//                                         <tr className="bg-gray-100 border-b">
//                                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
//                                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
//                                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Join Time</th>
//                                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Leave Time</th>
//                                             <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Duration (min)</th>
//                                             <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {data.participants.map((participant, index) => (
//                                             <tr
//                                                 key={index}
//                                                 className="border-b hover:bg-blue-50 transition"
//                                             >
//                                                 <td className="px-6 py-4 text-sm text-gray-800">{participant.name}</td>
//                                                 <td className="px-6 py-4 text-sm text-gray-600">{participant.email}</td>
//                                                 <td className="px-6 py-4 text-sm text-gray-600">
//                                                     {new Date(participant.joinTime).toLocaleTimeString()}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-sm text-gray-600">
//                                                     {new Date(participant.leaveTime).toLocaleTimeString()}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-sm text-center font-bold text-blue-600">
//                                                     {participant.duration}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-sm text-center">
//                                                     <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
//                                                         {participant.attentiveness_score}%
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {data.participants.length === 0 && (
//                                 <div className="px-6 py-8 text-center text-gray-500">
//                                     <p>No participants found for this meeting</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* Empty State */}
//                 {!data && !loading && !error && (
//                     <div className="bg-white rounded-lg shadow-md p-12 text-center">
//                         <p className="text-gray-500 text-lg">
//                             Enter a meeting ID to view attendance details
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

'use client';

import { useState } from 'react';

export default function ZoomParticipants() {
    const [meetingId, setMeetingId] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchParticipants = async (e) => {
        e?.preventDefault();

        if (!meetingId.trim()) {
            setError('Please enter a meeting ID');
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(
                `/api/zoom/participants?meetingId=${encodeURIComponent(meetingId)}`
            );
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch data');
            }

            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!data?.participants) return;

        const headers = ['Name', 'Email', 'Join Time', 'Leave Time', 'Duration (min)', 'Attentiveness Score'];
        const rows = data.participants.map(p => [
            `"${p.name}"`,
            `"${p.email}"`,
            p.joinTime !== 'N/A' ? `"${new Date(p.joinTime).toLocaleString()}"` : 'N/A',
            p.leaveTime !== 'N/A' ? `"${new Date(p.leaveTime).toLocaleString()}"` : 'N/A',
            p.duration,
            p.attentiveness_score || 'N/A',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `participants-${data.meeting.id}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyEmails = () => {
        if (!data?.participants) return;

        const emails = data.participants
            .map(p => p.email)
            .filter(e => e !== 'N/A')
            .join('; ');

        navigator.clipboard.writeText(emails);
        alert(`${data.participants.filter(p => p.email !== 'N/A').length} emails copied to clipboard!`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🎯 Zoom Attendance Tracker
                    </h1>
                    <p className="text-gray-600">Track meeting participants and export emails</p>
                </div>

                {/* Search Form */}
                <form onSubmit={fetchParticipants} className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Enter Meeting ID (e.g., 821 2571 0576)"
                                value={meetingId}
                                onChange={(e) => setMeetingId(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
                            >
                                {loading ? '⏳ Loading...' : '🔍 Search'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
                        <p className="font-bold">❌ Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Upgrade Notice */}
                {data?.accountType === 'free' && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg mb-8">
                        <p className="font-bold">⚠️ Paid Account Required</p>
                        <p>{data.message}</p>
                        <a
                            href={data.upgrade?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                            Upgrade to Zoom Pro
                        </a>
                    </div>
                )}

                {/* Results */}
                {data && (
                    <div className="space-y-6">
                        {/* Meeting Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {data.meeting.topic}
                                    </h2>
                                    <p className="text-gray-600">
                                        <strong>Meeting ID:</strong> {data.meeting.id}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Start Time:</strong> {new Date(data.meeting.startTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Duration:</strong> {data.meeting.duration} minutes
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Data Source:</strong> {data.dataSource === 'participant_report' ? '📊 Attendance Report' : data.dataSource === 'registrants' ? '📋 Registrants' : '❌ Not Available'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm">Total Participants</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {data.attendance.totalParticipants}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm">Total Duration</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {data.attendance.totalDuration}m
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm">Avg Duration</p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {data.attendance.averageDuration}m
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={exportToCSV}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                            >
                                📥 Export as CSV
                            </button>
                            <button
                                onClick={copyEmails}
                                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition"
                            >
                                📧 Copy All Emails
                            </button>
                        </div>

                        {/* Participants Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                                <h3 className="text-xl font-bold text-white">
                                    👥 Participants ({data.participants.length})
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 border-b">
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                            {data.dataSource === 'participant_report' && (
                                                <>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Join Time</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Leave Time</th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Duration (min)</th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.participants.map((participant, index) => (
                                            <tr
                                                key={index}
                                                className="border-b hover:bg-blue-50 transition"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-800">{participant.name}</td>
                                                <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{participant.email}</td>
                                                {data.dataSource === 'participant_report' && (
                                                    <>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {participant.joinTime !== 'N/A' ? new Date(participant.joinTime).toLocaleTimeString() : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {participant.leaveTime !== 'N/A' ? new Date(participant.leaveTime).toLocaleTimeString() : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center font-bold text-blue-600">
                                                            {participant.duration}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center">
                                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                                {participant.attentiveness_score}%
                                                            </span>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {data.participants.length === 0 && (
                                <div className="px-6 py-8 text-center text-gray-500">
                                    <p>No participants found for this meeting</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!data && !loading && !error && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg">
                            Enter a meeting ID to view participant emails and attendance details
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}