"use client";

import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log("Firebase User:", u);
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome, {user?.displayName?.split(" ")[0] || "Student"} 👋
          </h1>

          <p className="text-gray-400 mt-2">
            Ready to study today,{" "}
            {user?.displayName?.split(" ")[0] || "Student"}?
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Study Hours</h2>
          <p className="text-4xl font-bold mt-3">24.5h</p>
          <p className="text-green-500 mt-2">+12% from last week</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Exam Readiness</h2>
          <p className="text-4xl font-bold mt-3">82%</p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Course Progress</h2>
          <p className="text-4xl font-bold mt-3">4/6</p>
        </div>
      </div>
    </div>
  );
}