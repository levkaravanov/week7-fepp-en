import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <nav className="navbar">
      <h1>Product Search</h1>
      <div className="links">
        <a href="/">Home</a>
        <a href="/add-product">Add Product</a>
        {!isAuthenticated ? (
          <>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
          </>
        ) : (
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;