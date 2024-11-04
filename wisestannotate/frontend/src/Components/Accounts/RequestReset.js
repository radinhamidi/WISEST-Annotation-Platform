import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wisestMainPic from '../../images/wisestMainPic.png'

const BACKEND_URL = process.env.REACT_APP_API_BASE_URL
const REACT_APP_REQUEST_RESET = `${BACKEND_URL}/request-reset`;

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [waitingForResponse, setWaitingForResponse] = useState(false)


  const navigate = useNavigate();
 
  const handleRequestReset = async (e) => {
    e.preventDefault();
  
    if (!email) {
      setError('Email is required');
      return;
    }
  
    setWaitingForResponse(true)
    const response = await fetch(`${REACT_APP_REQUEST_RESET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
      })
    });
  
    const data = await response.json();
    if (response.ok) {
      setWaitingForResponse(false)
      navigate('/reset-password');
    } else {
      setWaitingForResponse(false)
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
                    <div style={{ position: 'absolute', top: '180px', left: '5px', backgroundColor: 'rgba(0, 0, 0, 0.1)'}} id="banner-overlay"><h1 class="title">WISEST</h1><h2 class="subtitle"><strong>W</strong>h<strong>I</strong>ch <strong>S</strong>ystematic<strong> E</strong>vidence <strong>S</strong>ynthesis is bes<strong>T</strong></h2><div class="button-container" id="try-button-small"><a href="/WisestTool"></a></div></div>
                  </div>
                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <div className="col-12 col-lg-11 col-xl-10">
                      <div className="card-body p-3 p-md-4 p-xl-5">
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-5">
                              <h4 className="text-center">Enter your email to recieve your reset code</h4>
                            </div>
                          </div>
                        </div>
                        <form onSubmit={handleRequestReset}>
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
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className="col-12">
                              <div className="d-grid">
                                {waitingForResponse === false && <button className="btn btn-dark btn-lg" type="submit">Request for Reset Code</button>}
                                {waitingForResponse === true && <h5 className="text-dark text-center">Requesting for code...</h5>}
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="row">
                          <div className="col-12">
                            <div className="d-flex justify-content-center mt-4">
                              <div className="link-secondary text-decoration-none btn px-1" onClick={() => navigate("/login")}>Back to</div>
                              <div className="text-primary btn hover-pointer px-0" onClick={() => navigate("/login")}> login page</div>
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

export default RequestReset;