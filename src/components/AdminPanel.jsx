import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import * as XLSX from "xlsx";

export default function AdminPanel() {
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const snapshot = await getDocs(collection(db, "entries"));
      setEntries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchEntries();

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, []);

  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await deleteDoc(doc(db, "entries", id));
    setEntries(entries.filter((e) => e.id !== id));
  };

  const downloadExcel = (type) => {
    const filtered = entries
      .filter((e) => e.entryType === type)
      .map((e) => ({
        EntryTime: formatDateTime(e.timestamp),
        SubAdmin: e.subAdmin || "",
        College: e.entryType === "Inter" ? e.collegeName || "" : "",
        EntryBy: e.entrytakenby || "",
        Player: e.playerName || "",
        Phone: e.phone || "",
        Gender: e.gender || "",
        Email: e.email || "",
        Sport: e.sport || "",
        Category: e.category || "",
        Department: e.department || "",
        Year: e.year || "",
        Amount: e.amount || "",
      }));

    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type);
    XLSX.writeFile(wb, `${type}_entries.xlsx`);
  };
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate();
    return date.toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };
  const sortedEntries = [...entries].sort((a, b) => {
  if (!a.timestamp || !b.timestamp) return 0;
  return a.timestamp.seconds - b.timestamp.seconds; 
});

const totalIntraAmount = sortedEntries
  .filter((e) => e.entryType === "Intra")
  .reduce((sum, e) => sum + Number(e.amount || 0), 0);

const totalInterAmount = sortedEntries
  .filter((e) => e.entryType === "Inter")
  .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <>
    
      <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-green-400 tracking-wide">
        VCET Sports Committee Master Admin
      </h2>
      <div className="flex gap-6 mb-4">
  <div className="bg-green-600/20 border border-green-500 p-4 rounded-lg">
    <p className="text-sm text-green-300">Total Intra Collection</p>
    <p className="text-2xl font-bold text-green-400">
      ₹ {totalIntraAmount}
    </p>
  </div>

  <div className="bg-blue-600/20 border border-blue-500 p-4 rounded-lg">
    <p className="text-sm text-blue-300">Total Inter Collection</p>
    <p className="text-2xl font-bold text-blue-400">
      ₹ {totalInterAmount}
    </p>
  </div>
</div>


      <div className="flex flex-col gap-12">
        {["Inter", "Intra"].map((type) => (
          <div
            key={type}
            className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                {type} College Entries
              </h3>
              <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                {entries.filter((e) => e.entryType === type).length} Entries
              </span>
            </div>
            <button
              onClick={() => downloadExcel(type)}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-sm font-semibold shadow-md transition"
            >
              Download {type}
            </button>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-[1000px] w-full border-collapse text-sm whitespace-nowrap">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <tr>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Entry Time
                    </th>

                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Entry By
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Player
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Phone
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Gender
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Email
                    </th>

                    {type === "Inter" && (
                      <th className="border p-3 text-xs uppercase tracking-wide">
                        College
                      </th>
                    )}

                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Sport
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Category
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Department
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="border p-3 text-xs uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedEntries
                    .filter((e) => e.entryType === type)
                    .map((e) => (
                      <tr
                        key={e.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="border p-3 text-sm text-gray-300">
  {formatDateTime(e.timestamp)}
</td>

                        <td className="border p-3">{e.entrytakenby || "-"}</td>
                        <td className="border p-3 font-medium">
                          {e.playerName}
                        </td>
                        <td className="border p-3">{e.phone}</td>
                        <td className="border p-3">{e.gender}</td>
                        <td className="border p-3">{e.email}</td>

                        {type === "Inter" && (
                          <td className="border p-3">{e.collegeName}</td>
                        )}

                        <td className="border p-3">{e.sport}</td>
                        <td className="border p-3">{e.category || "-"}</td>
                        <td className="border p-3">{e.department}</td>
                        <td className="border p-3 font-semibold">
                          ₹{e.amount}
                        </td>

                        <td className="border p-3 text-center">
                          <button
                            onClick={() => deleteEntry(e.id)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-md text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
