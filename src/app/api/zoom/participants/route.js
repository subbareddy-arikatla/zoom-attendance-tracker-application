// import { NextResponse } from 'next/server';

// export async function GET(request) {
//     try {
//         console.log('🔍 API Route Hit');

//         const { searchParams } = new URL(request.url);
//         const meetingId = searchParams.get('meetingId');

//         console.log('Meeting ID:', meetingId);

//         if (!meetingId) {
//             return NextResponse.json(
//                 { error: 'Meeting ID is required' },
//                 { status: 400 }
//             );
//         }

//         // Check environment variables
//         const accountId = process.env.ZOOM_ACCOUNT_ID;
//         const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
//         const clientSecret = process.env.ZOOM_CLIENT_SECRET;

//         console.log('Credentials Check:', {
//             accountId: accountId ? '✓' : '✗',
//             clientId: clientId ? '✓' : '✗',
//             clientSecret: clientSecret ? '✓' : '✗',
//         });

//         if (!accountId || !clientId || !clientSecret) {
//             return NextResponse.json(
//                 { error: 'Missing Zoom credentials in environment' },
//                 { status: 400 }
//             );
//         }

//         // Get Zoom Token
//         console.log('Requesting Zoom token...');
//         const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

//         const tokenResponse = await fetch(
//             `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Basic ${auth}`,
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );

//         console.log('Token Response Status:', tokenResponse.status);
//         const tokenData = await tokenResponse.json();
//         console.log('Token Response:', tokenData);

//         if (!tokenResponse.ok) {
//             console.error('Token Error:', tokenData);
//             return NextResponse.json(
//                 { error: 'Zoom authentication failed', details: tokenData },
//                 { status: 401 }
//             );
//         }

//         const accessToken = tokenData.access_token;
//         console.log('✓ Access token received');

//         // Get Participants
//         console.log('Fetching participants for meeting:', meetingId);
//         const participantsResponse = await fetch(
//             `https://api.zoom.us/v2/report/meetings/${meetingId}/participants?page_size=300`,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         console.log('Participants Response Status:', participantsResponse.status);
//         const participantsData = await participantsResponse.json();
//         console.log('Participants Data:', participantsData);

//         if (!participantsResponse.ok) {
//             console.error('Participants Error:', participantsData);
//             return NextResponse.json(
//                 { error: 'Failed to fetch participants', details: participantsData },
//                 { status: participantsResponse.status }
//             );
//         }

//         const participants = (participantsData.participants || []).map(p => ({
//             id: p.id,
//             name: p.name,
//             email: p.user_email || 'N/A',
//             joinTime: p.join_time,
//             leaveTime: p.leave_time,
//             duration: p.duration,
//         }));

//         return NextResponse.json({
//             success: true,
//             meeting: {
//                 id: meetingId,
//                 totalParticipants: participantsData.participant_count,
//             },
//             participants: participants,
//         });

//     } catch (error) {
//         console.error('❌ Error:', error.message);
//         console.error('Stack:', error.stack);

//         return NextResponse.json(
//             {
//                 error: error.message,
//                 type: error.name
//             },
//             { status: 500 }
//         );
//     }
// }

// filepath: [route.js](http://_vscodecontentref_/0)

// import { NextResponse } from 'next/server';
// import { getMeetingDetails } from '@/lib/zoom';

// export async function GET(request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const meetingId = searchParams.get('meetingId');

//         if (!meetingId) {
//             return NextResponse.json(
//                 { error: 'Meeting ID is required' },
//                 { status: 400 }
//             );
//         }

//         const cleanMeetingId = meetingId.replace(/\s/g, '');

//         console.log(`Fetching meeting details for: ${cleanMeetingId}`);

//         const meetingData = await getMeetingDetails(cleanMeetingId);

//         return NextResponse.json({
//             success: true,
//             message: 'Note: Detailed participant data requires a Paid Zoom account',
//             meeting: {
//                 id: meetingData.id,
//                 topic: meetingData.topic,
//                 startTime: meetingData.start_time,
//                 duration: meetingData.duration,
//                 timezone: meetingData.timezone,
//                 status: meetingData.status,
//             },
//             note: 'For attendance reports, please upgrade to Zoom Pro or higher',
//         });

//     } catch (error) {
//         console.error('Error:', error.message);

//         if (error.message.includes('Paid or ZMP')) {
//             return NextResponse.json(
//                 {
//                     error: 'This feature requires a Paid Zoom account (Pro, Business, or Enterprise)',
//                     upgrade_url: 'https://zoom.us/upgrade'
//                 },
//                 { status: 402 }
//             );
//         }

//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from 'next/server';
import { getMeetingDetails, getMeetingParticipants, getMeetingRegistrants } from '@/lib/zoom';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const meetingId = searchParams.get('meetingId');

        if (!meetingId) {
            return NextResponse.json(
                { error: 'Meeting ID is required' },
                { status: 400 }
            );
        }

        const cleanMeetingId = meetingId.replace(/\s/g, '');
        console.log(`Fetching data for meeting: ${cleanMeetingId}`);

        // Fetch meeting details
        const meetingData = await getMeetingDetails(cleanMeetingId);

        let participants = [];
        let accountType = 'free';
        let dataSource = 'none';

        // Try to get participants (requires paid account)
        try {
            console.log('Attempting to fetch participants from report...');
            const participantsData = await getMeetingParticipants(cleanMeetingId);

            participants = (participantsData.participants || []).map(p => ({
                id: p.id,
                name: p.name,
                email: p.user_email || 'N/A',
                joinTime: p.join_time,
                leaveTime: p.leave_time,
                duration: p.duration,
                attentiveness_score: p.attentiveness_score || 0,
            }));

            accountType = 'paid';
            dataSource = 'participant_report';
            console.log('✓ Fetched from participant report');

        } catch (error) {
            console.log('Paid feature not available, trying registrants...');

            // Fallback: Try to get registrants (free alternative)
            try {
                const registrantsData = await getMeetingRegistrants(cleanMeetingId);

                participants = (registrantsData.registrants || []).map(r => ({
                    id: r.id,
                    name: r.first_name + ' ' + r.last_name,
                    email: r.email,
                    status: r.status,
                    joinTime: 'N/A',
                    leaveTime: 'N/A',
                    duration: 'N/A',
                }));

                accountType = 'free_alternative';
                dataSource = 'registrants';
                console.log('✓ Fetched from registrants');

            } catch (registrantError) {
                console.log('Registrants also not available');
                accountType = 'free';
                dataSource = 'none';
            }
        }

        // Calculate statistics
        const totalDuration = participants.reduce((sum, p) => {
            const dur = parseInt(p.duration) || 0;
            return sum + dur;
        }, 0);
        const avgDuration = participants.length > 0 ? Math.round(totalDuration / participants.length) : 0;

        return NextResponse.json({
            success: true,
            accountType: accountType,
            dataSource: dataSource,
            message: accountType === 'free'
                ? 'Detailed participant data requires a Paid Zoom account. Upgrade to access attendance reports.'
                : 'Participant data retrieved successfully',
            meeting: {
                id: meetingData.id,
                topic: meetingData.topic,
                startTime: meetingData.start_time,
                duration: meetingData.duration,
                timezone: meetingData.timezone,
                status: meetingData.status,
            },
            attendance: {
                totalParticipants: participants.length,
                totalDuration: totalDuration,
                averageDuration: avgDuration,
            },
            participants: participants,
            upgrade: accountType === 'free' ? {
                url: 'https://zoom.us/upgrade',
                reason: 'Unlock detailed attendance reports and participant metrics'
            } : null,
        });

    } catch (error) {
        console.error('Error:', error.message);

        if (error.message.includes('Paid or ZMP')) {
            return NextResponse.json(
                {
                    error: 'This feature requires a Paid Zoom account',
                    accountType: 'free',
                    upgrade_url: 'https://zoom.us/upgrade'
                },
                { status: 402 }
            );
        }

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}