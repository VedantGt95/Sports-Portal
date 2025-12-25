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
      console.log("Attempting login for:", loginEmail);

     
      const userRef = doc(db, "users", loginEmail);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log("No Firestore document found");
        alert("User not registered!");
        return;
      }

      const data = userSnap.data();
      console.log("Firestore data:", data);

      const role = data.role?.trim().toLowerCase();

      if (role === "master") {
        console.log("Logging in master via Firebase Auth");
        await signInWithEmailAndPassword(auth, loginEmail, password);

      } else if (role === "sub") {
        console.log("Logging in sub-admin via Firestore password");
        if (data.password !== password) {
          alert("Invalid email or password");
          return;
        }

      } else {
        console.log("Invalid role:", data.role);
        alert("Invalid role");
        return;
      }

     
      await setDoc(userRef, { active: true }, { merge: true });

     
      if (role === "master") navigate("/admin");
      else if (role === "sub") navigate("/subadmin");

    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password");
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

        <button type="submit" className="w-full bg-blue-500 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}


