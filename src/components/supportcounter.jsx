import { useEffect, useMemo, useState } from "react";
import { doc, increment, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SupportCounter() {
  const [likes, setLikes] = useState(0); // Start with 0 instead of null
  const [hasSupported, setHasSupported] = useState(false);
  const [loading, setLoading] = useState(true);
  const totalGoal = 1000;

  const counterDocRef = useMemo(() => doc(db, "counter", "likes"), []);

  useEffect(() => {
    const fetchData = async () => {
      // 1) Get initial data first
      const snap = await getDoc(counterDocRef);
      if (snap.exists()) {
        setLikes(snap.data().likes || 0);
      } else {
        // Only create doc with 0 if it doesn't exist
        await setDoc(counterDocRef, { likes: 0 });
        setLikes(0);
      }
      setLoading(false);

      // 2) Then start real-time listener
      onSnapshot(counterDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setLikes(snapshot.data().likes || 0);
        }
      });
    };

    fetchData();

    // Check if user already supported
    if (localStorage.getItem("hasSupportedPunjab") === "true") {
      setHasSupported(true);
    }
  }, [counterDocRef]);

  const handleLike = async () => {
    if (hasSupported) return;

    try {
      await setDoc(counterDocRef, { likes: increment(1) }, { merge: true });
      setHasSupported(true);
      localStorage.setItem("hasSupportedPunjab", "true");
    } catch (error) {
      console.error("Error incrementing likes:", error);
    }
  };

  const progress = Math.min((likes / totalGoal) * 100, 100);

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-3">
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full px-4 py-2 shadow-sm border border-blue-200">
        <span className="font-medium text-gray-700 text-sm sm:text-base">
          Support Punjab
        </span>

        <div className="flex-1 mx-3 h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-1.5 bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <button
          onClick={handleLike}
          disabled={loading || hasSupported}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl ${
            hasSupported
              ? "bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-green-200"
              : "bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-blue-200 hover:shadow-blue-300"
          }`}
        >
          {hasSupported ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
