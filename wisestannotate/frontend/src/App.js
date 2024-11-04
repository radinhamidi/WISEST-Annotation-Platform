import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Accounts/Login.js';
import Register from './Components/Accounts/Register.js';
import Navbar from './Components/Navbar.js';
import './Styles/App.css';
import Annotator from './Components/Annotation/Annotator.js';
import ChooseAPdf from './Components/PDFs/ChooseAPdf.js';
import Users from './Components/AdminOnly/Users.js';
import SpecificUser from './Components/AdminOnly/SpecificUser.js';
import RequestReset from './Components/Accounts/RequestReset.js';
import ResetPassword from './Components/Accounts/ResetPassword.js';
import SqlQueryExecutor from './Components/SqlQueryExecutor.js';
import PDFDoiExtractor from './utils/PDFDoiExtractor.js';

export const CurrentSignedInUserContext = createContext();

function App() {
  const [currentSignedInUser, setCurrentSignedInUser] = useState({});
  const [currentSelectedPdfID, setCurrentSelectedPdfID] = useState('');
  const [currentQuoteFromSr, setCurrentQuoteFromSr] = useState([]);

  const onPdfSelect = (current_id) => {
    setCurrentSelectedPdfID(current_id);
  };

  const updateQuoteFromSRTextbox = (highlight) => {
    setCurrentQuoteFromSr(highlight);
    //console.log(currentQuoteFromSr);
  };

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/authenticate-user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authTokenWisest')}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentSignedInUser(userData);
          //console.log(`most recent signedin user: ${currentSignedInUser}`)

        } else {
          console.error('Failed to authenticate user');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    //console.log(`Current Signed In User: ${JSON.stringify(currentSignedInUser)}`);
  }, [currentSignedInUser]);

  return (
    <CurrentSignedInUserContext.Provider value={[currentSignedInUser, setCurrentSignedInUser]}>
      <Router>
        {Object.keys(currentSignedInUser).length === 0 ? (
          //if user isn't signed in or registered
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/request-reset" element={<RequestReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          //if user is signed in
          <>
            <Navbar />
            <Routes>
              <Route
                path="/choose-pdf"
                element={
                  currentSignedInUser.role === 'Pending' ? (
                    <h1 style={{ color: 'red', textAlign: 'center', marginTop: '30px' }}>
                      Please contact the administrator to assign you a role
                    </h1>
                  ) : (
                    <ChooseAPdf onPdfSelect={onPdfSelect} />
                  )
                }
              />
              <Route path="/choose-pdf/:pdfId" element={<Annotator />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:userId" element={<SpecificUser />} />
              <Route path="/sql" element={<SqlQueryExecutor />} />
              <Route path="*" element={<Navigate to="/choose-pdf" />} />
            </Routes>
          </>
        )}
      </Router>
    </CurrentSignedInUserContext.Provider>
  );
}

export default App;
