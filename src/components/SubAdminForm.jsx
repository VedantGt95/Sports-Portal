import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function SubAdminForm() {
  const [subAdmin, setSubAdmin] = useState("");

  const [formData, setFormData] = useState({
    entryType: "Intra",
    collegeName: "",
    playerName: "",
    entrytakenby: "",
    gender: "Male",
    phone: "",
    email: "",
    department: "",
    year: "FE",
    sport: "",
    category: "",
    amount: "",
  });

  const departments = [
    "ASH",
    "AI&DS",
    "COMPS",
    "CSE(DS)",
    "EXTC",
    "CIVIL",
    "MECH",
    "IT",
    "VLSI",
    "-",
  ];

  const years = ["FE", "SE", "TE", "BE","-"];

  const sportsMap = {
    Carrom: ["Singles", "Department", "Doubles", "Mix"],
    Chess: ["Boys", "Girls", "Doubles", "Mix"],
    "Table Tennis": ["Single", "Doubles", "Girls", "Department"],
    Athletics: ["100m", "200m", "Relay", "Shotput"],
    "Girls Cricket": ["-"],
    VolleyBall: ["Boys", "Girls"],
    "Tug of War": ["Boys", "Girls"],
    Football: ["Boys", "Girls"],
    Kabaddi: ["Boys", "Girls"],
    Badminton: ["Singles", "Doubles", "Department"],
    PowerLifting: ["-"],
    "Arm Wrestling": ["-"],
    FootVolley: ["-"],
    "Box Cricket": ["-"],
    "Overarm Cricket": ["-"],
    Throwball: ["-"],
    CarromGirls: ["Singles", "Doubles"],
    PickleBall:["Singles","Doubles"],
  };

  const sports = Object.keys(sportsMap);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSubAdmin(user.email);
        setDoc(doc(db, "users", user.email), { active: true }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (subAdmin) {
        setDoc(doc(db, "users", subAdmin), { active: false }, { merge: true });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [subAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entryData = {
      ...formData,
      subAdmin,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "entries"), entryData);

      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          subAdmin,
        }),
      });

      alert("Entry submitted successfully!");

      setFormData({
        entryType: "Intra",
        collegeName: "",
        playerName: "",
        entrytakenby: "",
        gender: "Male",
        phone: "",
        email: "",
        department: "",
        year: "FE",
        sport: "",
        category: "",
        amount: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-6 w-96 space-y-3 bg-white/10 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Sub Admin Entry</h2>

        <div className="flex gap-4 text-white">
          {["Inter", "Intra"].map((t) => (
            <label key={t}>
              <input
                type="radio"
                value={t}
                checked={formData.entryType === t}
                onChange={(e) =>
                  setFormData({ ...formData, entryType: e.target.value })
                }
              />{" "}
              {t}
            </label>
          ))}
        </div>

        {formData.entryType === "Inter" && (
          <input
            type="text"
            placeholder="College Name"
            value={formData.collegeName}
            onChange={(e) =>
              setFormData({ ...formData, collegeName: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
        )}

        {[
          ["Player/Captain Name", "playerName"],
          ["Entry taken by", "entrytakenby"],
          ["Phone Number", "phone"],
          ["Email", "email"],
        ].map(([placeholder, key]) => (
          <input
            key={key}
            type={key === "email" ? "email" : "text"}
            placeholder={placeholder}
            value={formData[key]}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
        ))}

        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <select
          value={formData.department}
          
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
        <option value="" disabled>
    Select Department
  </option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <select
          value={formData.sport}
          onChange={(e) =>
            setFormData({ ...formData, sport: e.target.value, category: "" })
          }
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        >
          <option value="">Select Sport</option>
          {sports.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {sportsMap[formData.sport] && (
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
            
          >
            <option value="">Select Category</option>
            {sportsMap[formData.sport].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <button className="w-full bg-blue-600 py-2 rounded text-white font-semibold">
          Submit
        </button>
      </form>
    </div>
  );
}
