import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton'; // Correct alias import
import './globals.css';

export const metadata = {
  title: 'Freelancer Payments Platform',
  description: 'Dashboard for managing milestones, disputes, work submissions, and payments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={headerStyle}>
          <h1>Freelancer Payments Platform</h1>
          <nav style={navStyle}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/milestones">Milestones</Link>
            <Link href="/submissions">Work Submissions</Link>
            <Link href="/review-submissions">Review Submissions</Link>
            <Link href="/disputes">Disputes</Link>
            <Link href="/payment">Payment</Link>
            <LogoutButton />
          </nav>
        </header>
        <main style={{ padding: '1rem' }}>{children}</main>
      </body>
    </html>
  );
}

const headerStyle = {
  background: '#333',
  color: '#fff',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const navStyle = {
  marginTop: '0.5rem',
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};
