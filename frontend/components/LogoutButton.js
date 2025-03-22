'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} style={buttonStyle}>
      Logout
    </button>
  );
}

const buttonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
};
