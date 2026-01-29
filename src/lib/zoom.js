// export async function getZoomAccessToken() {
//     const accountId = process.env.ZOOM_ACCOUNT_ID;
//     const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
//     const clientSecret = process.env.ZOOM_CLIENT_SECRET;

//     if (!accountId || !clientId || !clientSecret) {
//         throw new Error('Missing Zoom credentials in environment variables');
//     }

//     try {
//         const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

//         const response = await fetch(
//             `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Basic ${auth}`,
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );

//         if (!response.ok) {
//             const error = await response.json();
//             console.error('Zoom OAuth Error:', error);
//             throw new Error(`Zoom auth failed: ${error.error || error.reason}`);
//         }

//         const data = await response.json();
//         return data.access_token;
//     } catch (error) {
//         console.error('Token generation failed:', error);
//         throw error;
//     }
// }

// export async function getMeetingParticipants(meetingId) {
//     try {
//         const accessToken = await getZoomAccessToken();

//         const response = await fetch(
//             `https://api.zoom.us/v2/report/meetings/${meetingId}/participants?page_size=300`,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(`Zoom API Error: ${error.message || error.reason}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Failed to fetch participants:', error);
//         throw error;
//     }
// }

// export async function getMeetingDetails(meetingId) {
//     try {
//         const accessToken = await getZoomAccessToken();

//         const response = await fetch(
//             `https://api.zoom.us/v2/meetings/${meetingId}`,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(`Failed to fetch meeting details: ${error.message}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Failed to fetch meeting details:', error);
//         throw error;
//     }
// }

// export async function getZoomAccessToken() {
//     const accountId = process.env.ZOOM_ACCOUNT_ID;
//     const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
//     const clientSecret = process.env.ZOOM_CLIENT_SECRET;

//     if (!accountId || !clientId || !clientSecret) {
//         throw new Error('Missing Zoom credentials');
//     }

//     const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

//     const response = await fetch(
//         `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
//         {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Basic ${auth}`,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         }
//     );

//     if (!response.ok) {
//         const error = await response.json();
//         throw new Error(`Zoom auth failed: ${error.error}`);
//     }

//     const data = await response.json();
//     return data.access_token;
// }

// // This works on FREE accounts
// export async function getMeetingDetails(meetingId) {
//     try {
//         const accessToken = await getZoomAccessToken();

//         const response = await fetch(
//             `https://api.zoom.us/v2/meetings/${meetingId}`,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(`Failed to fetch meeting: ${error.message}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Error:', error);
//         throw error;
//     }
// }

export async function getZoomAccessToken() {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
        throw new Error('Missing Zoom credentials');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Zoom auth failed: ${error.error}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function getMeetingDetails(meetingId) {
    const accessToken = await getZoomAccessToken();

    const response = await fetch(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch meeting: ${error.message}`);
    }

    return await response.json();
}

// Get participants (REQUIRES PAID ACCOUNT)
export async function getMeetingParticipants(meetingId) {
    const accessToken = await getZoomAccessToken();

    const response = await fetch(
        `https://api.zoom.us/v2/report/meetings/${meetingId}/participants?page_size=300`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch participants');
    }

    return await response.json();
}

// Get meeting registrants (works on some free accounts)
export async function getMeetingRegistrants(meetingId) {
    const accessToken = await getZoomAccessToken();

    const response = await fetch(
        `https://api.zoom.us/v2/meetings/${meetingId}/registrants?page_size=300`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch registrants');
    }

    return await response.json();
}