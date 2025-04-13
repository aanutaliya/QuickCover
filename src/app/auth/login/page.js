'use client';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    const user = jwtDecode(credentialResponse.credential);
    console.log(user);
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Welcome to QuickCover</h1>
      <p className="text-center text-gray-600">
        Sign in to generate your cover letters
      </p>
      
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log('Login Failed')}
          shape="rectangular"
          size="large"
          text="signin_with"
          width="300"
        />
      </div>
    </div>
  );
}