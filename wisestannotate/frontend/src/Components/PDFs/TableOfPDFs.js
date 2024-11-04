import React, { useContext, useEffect, useState } from 'react'
import { CurrentSignedInUserContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../../utils/authentication'
import { CurrentListOfTablePDFsContext } from './ChooseAPdf'

const TableOfPDFs = ({ filteredPDFs, tableState }) => {
    const [currentSignedInUser, setCurrentSignedInUser] = useContext(CurrentSignedInUserContext)
    const [chatHistoryVisibility, setChatHistoryVisibility] = useState(false)
    const [currentChatHistoryPopupDetails, setCurrentChatHistoryPopupDetails] = useState({})
    const [workOnPaperPopupVisibility, setWorkOnPaperPopupVisibility] = useState(false)
    const [availableStatusPaper, setAvailableStatusPaper] = useState({})
    const [deletePaperVisibility, setDeletePaperVisibility] = useState(false)
    const [deletePaperMessage, setDeletePaperMessage] = useState('')
    const [refreshFetchAllPDFs, setRefreshFetchAllPDFs] = useContext(CurrentListOfTablePDFsContext)

    const OpenDeletePaperPopupVisibility = (PDF) => {
        setAvailableStatusPaper(PDF);
        setDeletePaperVisibility(true)
    }

    const CloseDeletePaperPopupVisibility = (PDF) => {
        setAvailableStatusPaper(PDF);
        setDeletePaperVisibility(false)
    }

    const OpenWorkOnPaperPopupVisibility = (PDF) => {
        setAvailableStatusPaper(PDF);
        setWorkOnPaperPopupVisibility(true)
    }

    const CloseWorkOnPaperPopupVisibility = (PDF) => {
        setWorkOnPaperPopupVisibility(false)
        setAvailableStatusPaper({});
    }

    const openChatHistoryPopup = (PDF) => {
        setCurrentChatHistoryPopupDetails(PDF)
        setChatHistoryVisibility(true)
    }

    const closeChatHistoryPopup = () => {
        setChatHistoryVisibility(false)
        setCurrentChatHistoryPopupDetails({})
    }
    const navigate = useNavigate()

    const handleOnClickForAvailablePapers = () => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/update-pdf-details`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updateType: 'status_and_annoted_by_update',
                pdf_id: availableStatusPaper.pdf_id,
                status: 'Being Worked On',
                annotated_by: currentSignedInUser.email

            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    //console.log('Status of Pdf saved successfully:', data);
                    // Handle success response from the server if needed
                    navigate(`/choose-pdf/${availableStatusPaper.pdf_id}`);
                }

            })
            .catch(error => {
                console.error('Error saving status of PDF:', error);
                // Handle error if the request fails
            });

    }

    const handleDeletePaper = async () => {
        try {
            const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/delete-pdf/${availableStatusPaper.pdf_id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setDeletePaperMessage('')
                const data = await response.json();
                setAvailableStatusPaper({})
                CloseDeletePaperPopupVisibility()
                //console.log(data.message);
                setRefreshFetchAllPDFs(!refreshFetchAllPDFs)
            } else {
                setDeletePaperMessage('')
                const errorData = await response.json();
                setAvailableStatusPaper({})
                setDeletePaperMessage(errorData.error || 'Failed to delete PDF')
                console.error(errorData.error || 'Failed to delete PDF');
                setRefreshFetchAllPDFs(!refreshFetchAllPDFs)
            }
        } catch (error) {
            setDeletePaperMessage('Error deleting PDF:', error)
            console.error('Error deleting PDF:', error);
        }
    };

    return (

        <div>
            {tableState === 'Your Papers' &&
                <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <div style={{ width: '100%' }} >
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">PDF ID</th>
                                    <th scope="col">PDF Name</th>
                                    <th scope="col">PDF Title</th>
                                    <th scope="col">Annotated By</th>
                                    <th scope="col">Validator(s)</th>
                                    <th scope="col">Chat History</th>
                                    <th scope="col">Uploaded By</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Choose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPDFs.length > 0 ? (
                                    filteredPDFs.map((PDF, index) => {
                                        if (PDF.annotated_by && Array.isArray(PDF.annotated_by) && !PDF.annotated_by.includes(currentSignedInUser.email)) return null
                                        if (PDF.status !== 'Revision Needed' && PDF.status !== 'Being Validated' && PDF.status !== 'Being Worked On') return null
                                        const annotatedByList = PDF.annotated_by && Array.isArray(PDF.annotated_by) ? PDF.annotated_by.join(', <br><br>') : '';
                                        const validatedByList = PDF.validated_by && Array.isArray(PDF.validated_by) ? PDF.validated_by.join(', <br><br>') : '';
                                        return (
                                            <tr key={index}>
                                                <td>{PDF.pdf_id}</td>
                                                <td>{PDF.pdf_file_name}</td>
                                                <td>{PDF.pdf_title}</td>
                                                <td dangerouslySetInnerHTML={{ __html: annotatedByList }}></td>
                                                <td dangerouslySetInnerHTML={{ __html: validatedByList }}></td>
                                                <td style={{ cursor: 'pointer' }} onClick={() => openChatHistoryPopup(PDF)}>
                                                    {
                                                        PDF.chat_history && PDF.chat_history.length > 0 && PDF.chat_history.split("——new line——").slice(0, 2).map((chat, index) => {
                                                            return (
                                                                <p key={index}>{chat}</p>
                                                            )
                                                        })
                                                    }
                                                    {PDF.chat_history && PDF.chat_history.length > 0 && PDF.chat_history.split("——new line——").length > 1 && <p style={{ color: 'blue' }}>View More</p>}

                                                </td>
                                                <td>{PDF.uploaded_by}</td>
                                                <td>
                                                    {PDF.status === 'Being Validated' && <span style={{ color: 'blue' }}>Being Validated</span>}
                                                    {PDF.status === 'Being Worked On' && <span style={{ color: 'green' }}>Being Worked On</span>}
                                                    {PDF.status === 'Revision Needed' && <span style={{ color: 'red' }}>Revision Needed</span>}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    {/* {PDF.status === 'Being Validated' && <span style={{ color: 'black' }}>Currently Being Validated...</span>} */}
                                                    {PDF.status === 'Being Worked On' && <button onClick={() => navigate(`/choose-pdf/${PDF.pdf_id}`)} type="button" className="btn btn-dark">Work on This</button>}
                                                    {PDF.status === 'Revision Needed' && <button onClick={() => navigate(`/choose-pdf/${PDF.pdf_id}`)} type="button" className="btn btn-dark">Work on This</button>}
                                                </td>
                                            </tr>
                                        );
                                    })

                                ) : (
                                    <tr>
                                        <td colSpan="3">No PDFs found.</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>

                    </div>

                </div>
            }

            {tableState === 'Available Papers' &&
                <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <div style={{ width: '100%' }} >
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">PDF ID</th>
                                    <th scope="col">PDF Name</th>
                                    <th scope="col">PDF Title</th>
                                    <th scope='col'>Uploaded By</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">View</th>
                                    <th scope="col">Choose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPDFs.length > 0 ? (
                                    filteredPDFs.map((PDF, index) => {
                                        if (PDF.status !== 'Available') {
                                            return null;
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>{PDF.pdf_id}</td>
                                                <td>{PDF.pdf_file_name}</td>
                                                <td>{PDF.pdf_title}</td>
                                                <td>{PDF.uploaded_by}</td>
                                                <td>{PDF.status}</td>
                                                <td style={{ alignItems: 'center' }}>
                                                    <button
                                                        style={{ marginBottom: '10px' }}
                                                        type="button"
                                                        className="btn btn-dark"
                                                        onClick={() => {
                                                            navigate(`/choose-pdf/${PDF.pdf_id}`);
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                        onClick={() => OpenWorkOnPaperPopupVisibility(PDF)}
                                                    >
                                                        Choose this Paper
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })

                                ) : (
                                    <tr>
                                        <td colSpan="6">No PDFs found.</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>

                </div>
            }

            {tableState === 'Completed Papers' &&
                <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <div style={{ width: '100%' }} >
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">PDF ID</th>
                                    <th scope="col">PDF Name</th>
                                    <th scope="col">PDF Title</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Annotated By</th>
                                    <th scope="col">Validator</th>
                                    <th scope='col'>Uploaded By</th>
                                    <th scope="col">View Only</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPDFs.length > 0 ? (
                                    filteredPDFs.map((PDF, index) => {
                                        if (PDF.status !== 'Completed') {
                                            return null;
                                        }
                                        const annotatedByList = PDF.annotated_by && Array.isArray(PDF.annotated_by) ? PDF.annotated_by.join(', <br><br>') : '';
                                        const validatedByList = PDF.validated_by && Array.isArray(PDF.validated_by) ? PDF.validated_by.join(', <br><br>') : '';

                                        return (
                                            <tr key={index}>
                                                <td>{PDF.pdf_id}</td>
                                                <td>{PDF.pdf_file_name}</td>
                                                <td>{PDF.pdf_title}</td>
                                                <td>{PDF.status}</td>
                                                <td dangerouslySetInnerHTML={{ __html: annotatedByList }}></td>
                                                <td dangerouslySetInnerHTML={{ __html: validatedByList }}></td>
                                                <td>{PDF.uploaded_by}</td>
                                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                        onClick={() => {
                                                            navigate(`/choose-pdf/${PDF.pdf_id}`);
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })

                                ) : (
                                    <tr>
                                        <td colSpan="7">No PDFs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            }

            <div key={refreshFetchAllPDFs}>
                {tableState === 'All Papers' && (currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator') &&
                    <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                        <div style={{ width: '100%' }} >
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">PDF ID</th>
                                        <th scope="col">PDF File Name</th>
                                        <th scope="col">PDF Title</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Annotated By</th>
                                        <th scope="col">Validator</th>
                                        <th scope='col'>Uploaded By</th>
                                        <th scope="col">Chat History</th>
                                        <th scope="col">View</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPDFs.length > 0 ? (
                                        filteredPDFs.map((PDF, index) => {
                                            const annotatedByList = PDF.annotated_by && Array.isArray(PDF.annotated_by) ? PDF.annotated_by.join(', <br><br>') : '';
                                            const validatedByList = PDF.validated_by && Array.isArray(PDF.validated_by) ? PDF.validated_by.join(', <br><br>') : '';
                                            return (
                                                <tr key={index}>
                                                    <td>{PDF.pdf_id}</td>
                                                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{PDF.pdf_file_name}</td>
                                                    <td>{PDF.pdf_title}</td>
                                                    <td>{PDF.status}</td>
                                                    <td dangerouslySetInnerHTML={{ __html: annotatedByList }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: validatedByList }}></td>
                                                    <td>{PDF.uploaded_by}</td>
                                                    <td style={{ cursor: 'pointer' }} onClick={() => openChatHistoryPopup(PDF)}>
                                                        {
                                                            PDF.chat_history && PDF.chat_history.length > 0 && PDF.chat_history.split("——new line——").slice(0, 2).map((chat, index) => {
                                                                return (
                                                                    <p key={index}>{chat}</p>
                                                                )
                                                            })
                                                        }
                                                        {PDF.chat_history && PDF.chat_history.length > 0 && PDF.chat_history.split("——new line——").length > 1 && <p style={{ color: 'blue' }}>View More</p>}

                                                    </td>
                                                    <td style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                        <button
                                                            style={{ marginBottom: '10px' }}
                                                            type="button"
                                                            className="btn btn-dark"
                                                            onClick={() => {
                                                                navigate(`/choose-pdf/${PDF.pdf_id}`);
                                                            }}
                                                        >
                                                            View
                                                        </button>
                                                        {PDF.status === 'Available' &&
                                                            <button
                                                                type="button"
                                                                className="btn btn-success"
                                                                onClick={() => OpenWorkOnPaperPopupVisibility(PDF)}
                                                            >
                                                                Work on This
                                                            </button>}
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => OpenDeletePaperPopupVisibility(PDF)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    ) : (
                                        <tr>
                                            <td colSpan="3">No PDFs found.</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>

                        </div>

                    </div>
                }
            </div>


            {tableState === 'Papers to be Approved' && (currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator') && //aprove paper
                <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <div style={{ width: '100%' }} >
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">PDF ID</th>
                                    <th scope="col">PDF File Name</th>
                                    <th scope="col">PDF Title</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Annotated By</th>
                                    <th scope="col">Validator</th>
                                    <th scope='col'>Uploaded By</th>
                                    <th scope="col">Chat History</th>
                                    <th scope="col">Choose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPDFs.length > 0 ? (
                                    filteredPDFs.map((PDF, index) => {
                                        if (PDF.status !== 'Being Validated' && PDF.status !== 'Re-Annotation Requested') return null
                                        const annotatedByList = PDF.annotated_by && Array.isArray(PDF.annotated_by) ? PDF.annotated_by.join(', <br><br>') : '';
                                        const validatedByList = PDF.validated_by && Array.isArray(PDF.validated_by) ? PDF.validated_by.join(', <br><br>') : '';

                                        return (
                                            <tr key={index}>
                                                <td>{PDF.pdf_id}</td>
                                                <td>{PDF.pdf_file_name}</td>
                                                <td>{PDF.pdf_title}</td>
                                                <td>{PDF.status}</td>
                                                <td dangerouslySetInnerHTML={{ __html: annotatedByList }}></td>
                                                <td dangerouslySetInnerHTML={{ __html: validatedByList }}></td>
                                                <td>{PDF.uploaded_by}</td>
                                                <td style={{ cursor: 'pointer' }} onClick={() => openChatHistoryPopup(PDF)}>
                                                    {
                                                        PDF.chat_history && PDF.chat_history.length > 0 && PDF.chat_history.split("——new line——").slice(0, 2).map((chat, index) => {
                                                            return (
                                                                <p key={index}>{chat}</p>
                                                            )
                                                        })
                                                    }
                                                    {PDF.chat_history && PDF.chat_history.length > 0 && PDF.chat_history.split("——new line——").length > 1 && <p style={{ color: 'blue' }}>View More</p>}

                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                        onClick={() => {
                                                            navigate(`/choose-pdf/${PDF.pdf_id}`);
                                                        }}
                                                    >
                                                        Work on This
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })

                                ) : (
                                    <tr>
                                        <td colSpan="3">No PDFs found.</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>

                    </div>

                </div>
            }

            {chatHistoryVisibility && currentChatHistoryPopupDetails && currentChatHistoryPopupDetails.chat_history && currentChatHistoryPopupDetails.chat_history.length > 0 && (
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
                            <h4 style={{ textAlign: 'center' }} className="card-title">Chat History</h4>
                            <h5 className="card-title">Paper ID: {currentChatHistoryPopupDetails.pdf_id}</h5>
                            <h5 className="card-title">Paper Title: {currentChatHistoryPopupDetails.pdf_title}</h5><hr />
                            <div className="chat-history" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                {
                                    currentChatHistoryPopupDetails.chat_history.split("——new line——").map((chat, index) => {
                                        return (
                                            <p key={index}>{chat}</p>
                                        )
                                    })
                                }
                            </div>

                            {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                            <hr />
                            <button className="btn btn-dark" onClick={closeChatHistoryPopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {workOnPaperPopupVisibility && (
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
                            <h3 style={{ textAlign: 'center' }} className="card-title">Confirmation</h3>
                            <h5 className="card-title">Are you sure you want to work on the Paper "{availableStatusPaper.pdf_title}"? The status will be changed from "Available" to "Being Worked On" by you.</h5>
                            <hr />
                            <button style={{ marginRight: '10px' }} className="btn btn-success" onClick={handleOnClickForAvailablePapers}>Yes, I want to work on this paper</button>
                            <button className="btn btn-danger" onClick={CloseWorkOnPaperPopupVisibility}>Cancel</button>
                        </div>
                    </div>

                    {tableState === 'Papers to be Approved' &&
                        <div className="card" style={{ width: '40rem' }}>
                            <div className="card-body" style={{ overflowY: 'auto' }} onScroll={e => e.stopPropagation()}>
                                <h3 style={{ textAlign: 'center' }} className="card-title">Confirmation</h3>
                                <h5 className="card-title">Are you sure you want to work on the Paper "{availableStatusPaper.pdf_title}"? The status will be changed from "Available" to "Being Worked On" by you.</h5>
                                <hr />
                                <button style={{ marginRight: '10px' }} className="btn btn-success" onClick={handleOnClickForAvailablePapers}>Yes, I want to work on this paper</button>
                                <button className="btn btn-danger" onClick={CloseWorkOnPaperPopupVisibility}>Cancel</button>
                            </div>
                        </div>}
                </div>
            )}

            {deletePaperVisibility && (
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
                            <h3 style={{ textAlign: 'center' }} className="card-title">Confirmation</h3>
                            <h5 className="card-title">Are you sure you want to delete the Paper "{availableStatusPaper.pdf_file_name}"?</h5>
                            <h6 style={{ color: 'red' }}>{deletePaperMessage}</h6>
                            <hr />
                            <button style={{ marginRight: '10px' }} className="btn btn-danger" onClick={handleDeletePaper}>Yes, I want to delete this paper</button>
                            <button className="btn btn-success" onClick={CloseDeletePaperPopupVisibility}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default TableOfPDFs