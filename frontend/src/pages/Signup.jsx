import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  const role = useField("text");
  const bio = useField("text");

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const lastLogin = new Date().toISOString();
    if (!role.value) {
      window.alert("Please select a role");
      return;
    }
    const result = await signup({
      email: email.value,
      password: password.value,
      name: name.value,
      role: role.value,
      lastLogin,
      bio: bio.value,
    });
    if (result?.ok) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    } else {
      console.log(result?.error || error);
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <label>Role:</label>
        <select value={role.value} onChange={role.onChange}>
          <option value="" disabled>Select role</option>
          <option value="Admin">Admin</option>
          <option value="Seller">Seller</option>
          <option value="Buyer">Buyer</option>
        </select>
        <label>Bio:</label>
        <input {...bio} />
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
