"use client";
import React, { useState } from 'react';
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E0F0FF] p-4">
      <div className="w-full max-w-md p-4 md:p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4 md:mb-8">
          <Image src="/logo.png" alt="Logo" width={150} height={75} className="w-[90%] h-[75px] md:w-[200px] md:h-[70px]" />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" className="w-full bg-darkBlue text-white" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <p className="text-center text-sm md:text-base text-darkBlue">
            Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline font-bold">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
