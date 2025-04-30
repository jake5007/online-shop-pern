import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { register, loading, error, user } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const nameRegex = /^[A-Za-z가-힣\s]{2,30}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nameRegex.test(name.trim())) {
      setLocalError(
        "Name must be 2 to 30 characters long and contain only Korean or English letters"
      );
      return;
    }

    setLocalError("");
    register(name, email, password);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register</h2>

      {(localError || error) && (
        <div className="text-red-500 mb-4">{localError || error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="input input-bordered"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input input-bordered"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};
export default RegisterPage;
