import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabaseClient';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setForm({
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
  };


const firebaseUser = auth.currentUser;
if (firebaseUser) {
  console.log('✅ Firebase UID:', firebaseUser.uid);
}

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, username } = form;

    if (isSignup) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  const uid = firebaseUser.uid;

  console.log('✅ Signup success:', firebaseUser);

  // ✅ Upsert profile to Supabase
  const { data, error } = await supabase.from("profiles").upsert({
    id: uid,
    name: username,
    bio: '',
    avatar_url: ''
  });

  if (error) {
    console.error("❌ Supabase profile error:", error.message);
    alert("Signup succeeded, but profile save failed.");
  } else {
    console.log("✅ Profile inserted in Supabase:", data);
  }

  router.push('/');
} catch (err) {
  alert(err.message);
}

    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login success:', userCredential.user);
        router.push('/');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-md shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignup ? 'Create Account' : 'Log In'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="text-sm">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Your username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          )}

          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {isSignup && (
            <div>
              <label className="text-sm">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button onClick={toggleForm} className="text-blue-500 hover:underline">
                Log in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={toggleForm} className="text-blue-500 hover:underline">
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
