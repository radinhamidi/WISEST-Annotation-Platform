import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/authentication';

const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;
const REACT_APP_REGISTER = `${BACKEND_URL}/update-user/`;
const REACT_APP_DELETE_USER = `${BACKEND_URL}/delete-user/`;

const SpecificUser = () => {
    const { userId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('')
    const [deleteUserWarningPopupVisibility, setDeleteUserWarningPopupVisibility] = useState(false)

    const navigate = useNavigate()

    const openDeleteUserWarningPopup = () => {
        setDeleteUserWarningPopupVisibility(true)
    }

    const closeDeleteUserWarningPopup = () => {
        setDeleteUserWarningPopupVisibility(false)
    }

    const handleUpdate = async () => {
        setSuccessMessage('')
        setError('')
        //console.log('the name here is: ', name)
        if (!name || !email || !role) {
            setError('All fields are required');
            return;
        }

        const response = await fetchWithAuth(`${REACT_APP_REGISTER}${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                role,
            })
        });

        const data = await response.json();
        if (response.ok) {
            //console.log(`data.message: ${data.message}`); // Success message
            setSuccessMessage(data.message)
        } else {
            setError(data.error); // Display error message
        }
    };

    useEffect(() => {
        try {
            fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/get-user/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch User');
                    }

                    return response.json()

                })
                .then(data => {
                    //console.log(`name for now is: ${JSON.stringify(data)}`)
                    setName(data[0].name)
                    setEmail(data[0].email)
                    setRole(data[0].role)
                })

        } catch (error) {
            console.error('Error fetching User:', error);
        }
    }, [userId])

    const handleDeleteUser = async () => {
        setSuccessMessage('');
        setError('');

        const response = await fetchWithAuth(`${REACT_APP_DELETE_USER}${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            //console.log(`data.message: ${data.message}`); 
            navigate('/users'); 
        } else {
            setError(data.error); 
        }
    };


    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="col-12 col-lg-11 col-xl-10">
                    <div className="card-body p-3 p-md-4 p-xl-5">
                        <div className="row">
                            <div className="col-12">
                                <div className="mb-5">
                                    <h4 className="text-center">Welcome!</h4>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}>
                            <div className="row gy-3 overflow-hidden">
                                <h1 style={{ color: 'black', marginBottom: '20px' }} >Update a User</h1>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            id="name"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <label htmlFor="name" className="form-label">Name</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            id="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label htmlFor="email" className="form-label">Email</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            name="role"
                                            id="role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Validator">Validator</option>
                                            <option value="Annotator">Annotator</option>

                                        </select>
                                        <label htmlFor="role" className="form-label">Role</label>
                                    </div>
                                </div>

                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                                <div className="col-12">
                                    <div className="d-grid">
                                        <button className="btn btn-dark btn-lg">Update User</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="row mt-4">
                            <div className="col-6">
                                <button className='btn btn-primary w-100'>Reset Password</button>
                            </div>
                            <div className="col-6">
                                <button className='btn btn-danger w-100' onClick={openDeleteUserWarningPopup}>Delete User</button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex justify-content-center mt-4">
                                    <div className="link-secondary text-decoration-none btn px-1" onClick={() => navigate("/users")}>Go back to</div>
                                    <div className="text-primary btn hover-pointer px-0" onClick={() => navigate("/users")}>Accounts Page</div>
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
            {deleteUserWarningPopupVisibility && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    overflow: 'hidden'
                }}>
                    <div className="card" style={{ width: '40rem' }}>
                        <div className="card-body" style={{ overflowY: 'auto' }} onScroll={e => e.stopPropagation()}>
                            <h4 style={{ textAlign: 'center' }} className="card-title">Are you sure you want to delete this user?</h4>
                            <h5 className="card-title">ID: {userId}</h5>
                            <h5 className="card-title">Email: {email}</h5>
                            <h5 className="card-title">Role: {role}</h5><hr />
                            <button style={{marginRight: '10px'}} className="btn btn-success" onClick={handleDeleteUser}>Yes, Delete this user</button>
                            <button className="btn btn-danger" onClick={closeDeleteUserWarningPopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default SpecificUser;
