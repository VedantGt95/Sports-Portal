import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginEmail = email.trim().toLowerCase();

    try {
      const userRef = doc(db, "users", loginEmail);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User not registered!");
        return;
      }

      const data = userSnap.data();
      const role = data.role?.trim().toLowerCase();

      // 🔐 MASTER ADMIN (Firebase Auth)
      if (role === "master") {
        await signInWithEmailAndPassword(auth, loginEmail, password);
        await setDoc(userRef, { active: true }, { merge: true });
        navigate("/admin");
        return;
      }

      // 🔓 SUB ADMIN (Firestore only – Option A)
      if (role === "sub") {
        if (data.password !== password) {
          alert("Invalid email or password");
          return;
        }

        // manual session
        localStorage.setItem("subAdminEmail", loginEmail);
        localStorage.setItem("subAdminRole", "sub");

        await setDoc(userRef, { active: true }, { merge: true });
        navigate("/subadmin");
        return;
      }

      alert("Invalid role");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="glass p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          required
        />

        <button className="w-full bg-blue-500 py-2 rounded text-white">
          Login
        </button>
      </form>
    </div>
  );
}
