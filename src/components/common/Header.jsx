import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  const dashboardLink = isAdmin ? '/admin' : '/employee';
  
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <Link to={dashboardLink}>Taskify</Link>
        </div>
        
        <div className="header-mobile-toggle" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
        
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li onClick={closeMenu}>
              <Link to={dashboardLink}>Dashboard</Link>
            </li>
            
            {currentUser && (
              <li className="user-profile">
                <div className="profile-info">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="avatar" />
                  ) : (
                    <FiUser size={24} />
                  )}
                  <span className="username">{currentUser.name}</span>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;