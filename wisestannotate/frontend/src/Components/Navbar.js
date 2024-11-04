import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';
import { CurrentSignedInUserContext } from '../App';

const Navbar = () => {
    const [currentSignedInUser, setCurrentSignedInUser] = useContext(CurrentSignedInUserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authTokenWisest')}`
            }
          });
      
          if (response.ok) {
            setCurrentSignedInUser({});
            localStorage.removeItem('authTokenWisest');
            navigate('/login');
          } else {
            console.error('Logout failed');
          }
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    return (
        <div className="navbar">
            {currentSignedInUser && currentSignedInUser.email && currentSignedInUser.email.length > 0 && (
                <>
                    {currentSignedInUser.role !== 'Pending' &&
                        <Link to="/choose-pdf" className="navbar-item navbara-and-dropdown-items">
                            Choose a Paper
                        </Link>}
                    {(currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator') &&
                        <Link to="/users" className="navbar-item navbara-and-dropdown-items">
                            Users
                        </Link>
                    }
                     {(currentSignedInUser.email === 'adam.azizi@torontomu.ca' || currentSignedInUser.email === 'radin.h@gmail.com' || currentSignedInUser.email === 'Admin@gmail.com' ) &&
                        <Link to="/sql" className="navbar-item navbara-and-dropdown-items">
                            SQL
                        </Link>
                    }
                    <div className="navbar-item navbara-and-dropdown-items" onClick={handleLogout}>
                        Logout
                    </div>
                    <div style={{ color: 'white', right: '0px', position: 'absolute' }}>
                        <b><u>User:</u></b>
                        <span style={{ color: 'lime' }}>&nbsp;&nbsp;&nbsp;{currentSignedInUser.email}&nbsp;&nbsp;&nbsp;</span>
                        <b><u>Role:</u></b>
                        <span style={{ color: 'lime' }}>&nbsp;&nbsp;&nbsp;{currentSignedInUser.role}&nbsp;&nbsp;&nbsp;</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;
