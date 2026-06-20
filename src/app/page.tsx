"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Lumina AI</h1>

        <p className="mt-4">
          Welcome! Please sign in with Google.
        </p>

        <button
          onClick={handleLogin}
          className="mt-6 rounded bg-blue-600 px-6 py-3 text-white"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}