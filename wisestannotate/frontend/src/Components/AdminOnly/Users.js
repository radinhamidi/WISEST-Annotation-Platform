import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentSignedInUserContext } from '../../App';
import { fetchWithAuth } from '../../utils/authentication';

const Users = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentSignedInUser, setCurrentSignedInUser] = useContext(CurrentSignedInUserContext)

   
    // if (currentSignedInUser.role && currentSignedInUser.role !== 'Admin') {
    //     return navigate('/login')
    // }
    useEffect(() => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/get-all-users`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json()
            })
            .then(data => {
                setUserData(data)
                // console.log(`pdf data is: ${userData}`)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    useEffect(() => {
        const filterPDFs = () => {
            const filtered = userData.filter(user => {
                // Filter by email, name, role or ID
                const userName = user.id && user.name && user.email && user.role && user.created_at && user.updated_at ? user.name.toLowerCase() : '';
                return userName.includes(searchTerm.toLowerCase()) ||
                    user.id.toString().includes(searchTerm) ||
                    user.email.includes(searchTerm.toLowerCase()) ||
                    user.role.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    ;
            });
            setFilteredUsers(filtered);
        };

        filterPDFs();
    }, [searchTerm, userData]);

    const formatTimestamp = (timestamp) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'America/New_York' // Eastern Time
        };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(timestamp));
        return formattedDate;
    };


    return (
        <div>

            <div style={{ display: 'flex', width: '100%', marginLeft: '20px' }}>
                <div style={{ display: 'flex', marginRight: '40px' }}
                    className="input-group mb-3 mt-3">
                    <div>
                        <span className="input-group-text" id="inputGroup-sizing-default">Search</span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by ID, Name, Email, or Role"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                    />
                </div>
            </div>

            <div style={{ marginLeft: '20px', marginRight: '20px' }} >
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">User ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">User Created at</th>
                            <th scope="col">User Updated at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{formatTimestamp(user.created_at)}</td>
                                    <td>{formatTimestamp(user.updated_at)}</td>
                                    {currentSignedInUser.role === 'Admin' && <td>
                                        <button
                                            type="button"
                                            className="btn btn-dark"
                                            onClick={() => {
                                                navigate(`/users/${user.id}`)
                                            }}
                                        >
                                            Update This User
                                        </button>
                                    </td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No Users found.</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Users;