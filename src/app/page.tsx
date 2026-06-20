"use client";

import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();

  const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString(),
    });

    router.push("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Lumina AI
        </h1>

        <p className="mb-8">
          Sign in with your Google account.
        </p>

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}