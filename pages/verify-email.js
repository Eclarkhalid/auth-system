import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyEmail() {
  const [status, setStatus] = useState('Verifying...');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const { token } = router.query;

      if (token) {
        try {
          const res = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          const data = await res.json();

          if (res.ok) {
            setStatus('Email verified successfully. You can now log in.');
            setIsSuccess(true);
          } else {
            setStatus(data.message);
          }
        } catch (error) {
          setStatus('An error occurred. Please try again.');
        }
      }
    };

    if (router.isReady) {
      verifyEmail();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Alert variant={isSuccess ? "default" : "destructive"}>
          <AlertDescription className={isSuccess ? "text-green-600" : ""}>{status}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}