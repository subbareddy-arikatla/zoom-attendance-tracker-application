import './globals.css';

export const metadata = {
  title: 'Zoom Attendance Tracker',
  description: 'Track meeting attendance and generate reports',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}