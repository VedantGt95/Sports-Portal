import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SubAdminForm() {
  const [subAdmin, setSubAdmin] = useState("");
  const navigate = useNavigate();

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
    "ASH","AI&DS","COMPS","CSE(DS)","EXTC",
    "CIVIL","MECH","IT","VLSI","-"
  ];

  const years = ["FE", "SE", "TE", "BE", "-"];

  const sportsMap = {
    Carrom: ["Singles", "Doubles", "Mix"],
    Chess: ["Boys", "Girls"],
    "Table Tennis": ["Singles", "Doubles"],
    Athletics: ["100m", "200m", "Relay"],
    Football: ["Boys"],
    Kabaddi: ["Boys"],
    Badminton: ["Singles", "Doubles"],
    PowerLifting: ["-"],
  };

  const sports = Object.keys(sportsMap);

  /* =====================
     SESSION CHECK
     ===================== */
  useEffect(() => {
    const email = localStorage.getItem("subAdminEmail");
    const role = localStorage.getItem("subAdminRole");

    if (!email || role !== "sub") {
      navigate("/");
      return;
    }

    setSubAdmin(email);
    setDoc(doc(db, "users", email), { active: true }, { merge: true });
  }, [navigate]);

  /* =====================
     ACTIVE FALSE ON CLOSE
     ===================== */
  useEffect(() => {
    const handleUnload = () => {
      if (subAdmin) {
        setDoc(doc(db, "users", subAdmin), { active: false }, { merge: true });
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [subAdmin]);

  /* =====================
     HANDLE CHANGE
     ===================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =====================
     SUBMIT ENTRY
     ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "entries"), {
        ...formData,
        subAdmin,
        timestamp: serverTimestamp(),
      });

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, subAdmin }),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-6 w-96 space-y-3 bg-white/10 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white">Sub Admin Entry</h2>

        <select name="entryType" value={formData.entryType} onChange={handleChange} className="w-full p-2 rounded">
          <option>Intra</option>
          <option>Inter</option>
        </select>

        <input name="collegeName" placeholder="College Name" value={formData.collegeName} onChange={handleChange} className="w-full p-2 rounded" />
        <input name="playerName" placeholder="Player Name" value={formData.playerName} onChange={handleChange} className="w-full p-2 rounded" />
        <input name="entrytakenby" placeholder="Entry Taken By" value={formData.entrytakenby} onChange={handleChange} className="w-full p-2 rounded" />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 rounded" />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded" />

        <select name="department" value={formData.department} onChange={handleChange} className="w-full p-2 rounded">
          <option value="">Department</option>
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>

        <select name="year" value={formData.year} onChange={handleChange} className="w-full p-2 rounded">
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>

        <select name="sport" value={formData.sport} onChange={handleChange} className="w-full p-2 rounded">
          <option value="">Sport</option>
          {sports.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 rounded">
          <option value="">Category</option>
          {formData.sport &&
            sportsMap[formData.sport]?.map((c) => (
              <option key={c}>{c}</option>
            ))}
        </select>

        <input name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="w-full p-2 rounded" />

        <button className="w-full bg-blue-600 py-2 rounded text-white font-semibold">
          Submit Entry
        </button>
      </form>
    </div>
  );
}
