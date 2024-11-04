import React, { useState, useContext } from 'react';
import { CurrentSignedInUserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import wisestMainPic from '../../images/wisestMainPic.png'
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL
const REACT_APP_LOGIN = `${BACKEND_URL}/login`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [currentSignedInUser, setCurrentSignedInUser] = useContext(CurrentSignedInUserContext)

  const navigate = useNavigate();
  //console.log(`inside the path login: ${JSON.stringify(currentSignedInUser)}`)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const response = await fetch(`${REACT_APP_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();
    if (response.ok) {
      setCurrentSignedInUser(data.user);
      localStorage.setItem('authTokenWisest', data.token);
      navigate('/choose-pdf');
    } else {
      setError(data.error);
    }
  };


  return (
    <div className='mt-5'>
      <section className="p-3 p-md-4 p-xl-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xxl-11">
              <div className="card border-light-subtle shadow-lg">
                <div className="row g-0">
                  <div className="col-12 col-md-6" style={{ position: 'relative' }}>
                    <img className="img-fluid rounded-start w-100 h-100 object-fit-cover" loading="lazy" src={wisestMainPic} alt="Welcome back you've been missed!" />
                    <div style={{ position: 'absolute', top: '180px', left: '5px', backgroundColor: 'rgba(0, 0, 0, 0.1)' }} id="banner-overlay"><h1 class="title">WISEST</h1><h2 class="subtitle"><strong>W</strong>h<strong>I</strong>ch <strong>S</strong>ystematic<strong> E</strong>vidence <strong>S</strong>ynthesis is bes<strong>T</strong></h2><div class="button-container" id="try-button-small"><a href="/WisestTool"></a></div></div>
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <div className="col-12 col-lg-11 col-xl-10">
                      <div className="card-body p-3 p-md-4 p-xl-5">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-5">
                              <h4 className="text-center">Welcome back!</h4>
                            </div>
                          </div>
                        </div>
                        <form onSubmit={handleLogin}>
                          <div className="row gy-3 overflow-hidden">
                            <div className="col-12">
                              <div className="form-floating mb-3">
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  id="email"
                                  placeholder="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="email" className="form-label">Email</label>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-floating mb-3">
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  id="password"
                                  placeholder="Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="password" className="form-label">Password</label>
                              </div>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className="col-12">
                              <div className="d-grid">
                                <button className="btn btn-dark btn-lg" type="submit">Login</button>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="row">
                          <div className="col-12">
                            <div className="d-flex justify-content-center mt-4 flex-column align-items-center">
                              <div style={{ color: "black" }} className="btn px-1">Forgot Password? <span className='text-primary' onClick={() => navigate("/request-reset")}>Reset Here</span></div>
                              <div style={{ color: "black" }} className="btn px-1">New User? <span className='text-danger' onClick={() => navigate("/register")}>Register Here</span></div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;