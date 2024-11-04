import React, { useState, useEffect, useContext, createContext } from 'react';
import { CurrentSignedInUserContext } from '../../App';
import { json, useNavigate } from 'react-router-dom';
import TableOfPDFs from './TableOfPDFs';
import { PDFDocument } from 'pdf-lib';
import { addMissingNumbersInArray, fetchWithAuth, hasCommonNumberInTwoArrays } from '../../utils/authentication';
import { extractDOI } from '../../utils/PDFDoiExtractor';


export const CurrentListOfTablePDFsContext = createContext();

const ChooseAPdf = ({ onPdfSelect }) => {
    const [pdfData, setPdfData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPDFs, setFilteredPDFs] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [tableState, setTableState] = useState('Your Papers');
    const [filesUploadedCount, setFilesUploadedCount] = useState(0);
    const [uploadedFiles, setSetuploadedFiles] = useState([])
    const [uploadDocumentPopupVisibility, setUploadDocumentPopupVisibility] = useState(false)
    const [updatePDFDetails, setUpdatePDFDetails] = useState([])
    const [documentPopupMessage, setDocumentPopupMessage] = useState('')
    const [refreshFetchAllPDFs, setRefreshFetchAllPDFs] = useState(false)
    const [documentPreuploadPopupVisibility, setDocumentPreuploadPopupVisibility] = useState(false)
    const [orderOfFiles, setOrderOfFiles] = useState([])
    const [currentInputForMerge, setCurrentInputForMerge] = useState([])
    const [messageForPreUpload, setMessageForPreUpload] = useState('')
    const [inputValues, setInputValues] = useState({})
    const [pdfIDWithDoi, setpdfIDWithDoi] = useState('')

    const [currentSignedInUser, setCurrentSignedInUser] = useContext(CurrentSignedInUserContext);
    const navigate = useNavigate();

    const openUploadDocumentPopupVisibility = () => {
        setUploadDocumentPopupVisibility(true)
    }

    const closeUploadDocumentPopupVisibility = () => {
        setUploadDocumentPopupVisibility(false)
    }

    const openDocumentPreuploadPopupVisibility = () => {
        setDocumentPreuploadPopupVisibility(true)
    }

    const closeDocumentPreuploadPopupVisibility = () => {
        setDocumentPreuploadPopupVisibility(false)
    }


    const handleFileChange = (event) => {
        // const files = event.target.files;
        // if (files) {
        //     const fileList = Array.from(files).map(file => ({
        //         name: file.name,
        //         size: file.size,
        //         type: file.type,
        //         lastModified: file.lastModified,
        //     }));
        //     console.log('Selected Files:', fileList);
        //     setSelectedFiles(fileList); // Update state with the array of file details
        // }
        setSelectedFiles(event.target.files)
    };

    const fetchAndSaveDoi = async (doi, file_name) => {
        try {
            const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/save-doi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doi, file_name }),
            });

            if (!response.ok) {
                throw new Error('Failed to save DOI and file name');
            }

            const data = await response.json();
            console.log('Response from server:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Assuming you have set up environment variables and a fetchWithAuth function for authenticated requests

    const isDoiInDatabase = async (doi) => {
        try {
            const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/check-doi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doi })
            });

            if (!response.ok) {
                throw new Error('Failed to check DOI existence');
            }

            const data = await response.json();
            console.log('Response from server:', data);

            if (data.exists) {
                console.log('DOI exists in the database');
                setMessageForPreUpload(data.message)
                // Handle the case where DOI exists
                return true
            } else {
                console.log('DOI does not exist in the database');
                setMessageForPreUpload('')
                // Handle the case where DOI does not exist
                return false
            }
        } catch (error) {
            console.error('Error:', error);
            return true
        }
    };


    const handleSubmitPDFUpload = async (event) => {
        setUploadSuccess(false);
        setUploadError('');
        setFilesUploadedCount(0); // Reset uploaded files count

        // setMessageForPreUpload('')
        // for (let i = 0; i < selectedFiles.length; i++) {
        //     try {
        //         const doi = await extractDOI(selectedFiles[i]);
        //         if (await isDoiInDatabase(doi)) {
        //             return
        //         }
        //     } catch (error) {
        //         console.error(`Error checking DOI for file ${selectedFiles[i].name}:`, error);
        //         return
        //     }
        // }
        console.log(`selected thigns files i see: ${selectedFiles.length - 1}`)
        const completeOrderOfFiles = addMissingNumbersInArray(0, selectedFiles.length - 1, orderOfFiles);
        // Check if more than 10 files are selected
        if (selectedFiles.length > 10) {
            setUploadSuccess(false);
            setFilesUploadedCount(0);
            setUploadError('Maximum of 10 files can be uploaded at once.');
            return;
        }

        // Helper function to merge PDFs
        const mergePDFs = async (files) => {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            }
            return await mergedPdf.save();
        };

        // Merge PDFs based on orderOfFiles
        const mergedFiles = [];
        for (const order of completeOrderOfFiles) {
            const filesToMerge = order.map(index => selectedFiles[index]);

            // Extract DOIs before merging
            const dois = [];
            for (const file of filesToMerge) {
                const doi = await extractDOI(file);
                dois.push(doi);
            }

            const mergedPdfBytes = await mergePDFs(filesToMerge);

            // Determine file name based on the number of files merged
            let fileName = '';
            if (filesToMerge.length > 1) {
                fileName = 'merged_' + filesToMerge.map(file => file.name.split('.pdf')[0]).join('_') + '.pdf';
            } else {
                fileName = filesToMerge[0].name;
            }

            const mergedFile = new File([mergedPdfBytes], fileName, { type: 'application/pdf' });
            mergedFiles.push({ file: mergedFile, dois });
        }

        for (let i = 0; i < mergedFiles.length; i++) {
            const formData = new FormData();
            formData.append('pdf', mergedFiles[i].file);
            formData.append('uploaded_by', currentSignedInUser.email); // Add email to form data
            formData.append('pdf_doi', JSON.stringify(mergedFiles[i].dois)); // Add DOIs to form data
            console.log(`name of selected pdf #${i}: ${JSON.stringify(mergedFiles[i].file.name)}`);

            try {
                const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/upload-pdf`, {
                    method: 'POST',
                    body: formData
                });

                if (response.status === 400) {
                    const errorData = await response.json();
                    console.log(JSON.stringify(errorData.error));
                    setUploadError(`Error uploading file ${mergedFiles[i].file.name}`);
                    setMessageForPreUpload(errorData.error)
                    return; // Stop uploading if there's an error
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                closeDocumentPreuploadPopupVisibility();
                setCurrentInputForMerge([]);
                setOrderOfFiles([]);

                console.log(`The result I am looking at is: ${JSON.stringify(result.pdf_id)}`);
                console.log(`File ${mergedFiles[i].file.name} uploaded successfully:`, result);
                setSetuploadedFiles(prev => [...prev, { pdf_id: result.pdf_id, pdf_file_name: result.pdf_file_name }]);
                setFilesUploadedCount(prevCount => prevCount + 1); // Increment uploaded files count
            } catch (error) {
                setUploadSuccess(false);
                setFilesUploadedCount(0);
                setUploadError(`Error uploading file ${mergedFiles[i].file.name}. Please try again.`);
                console.error(`Error uploading file ${mergedFiles[i].file.name}:`, error);
                return; // Stop uploading if there's an error
            }
        }


        // for (let i = 0; i < selectedFiles.length; i++) {
        //     try {
        //         const doi = await extractDOI(selectedFiles[i]);
        //         await fetchAndSaveDoi(doi, selectedFiles[i].name);
        //         console.log(`DOI ${i} saved successfully: ${doi}`);
        //     } catch (error) {
        //         console.error(`Error saving DOI for file ${selectedFiles[i].name}:`, error);
        //     }
        // }

        // Clear selectedFiles after successful upload
        setUploadSuccess(true);
        setSelectedFiles([]);
        setUploadError('');
        setUploadDocumentPopupVisibility(true);
    };



    useEffect(() => {
        // { console.log(`the thing is: ${JSON.stringify(updatePDFDetails)}`) }
    }, [updatePDFDetails])

    const handleUpdatePdfDetails = async () => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/update-pdf-details`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updateType: 'pdf_title_update',
                pdf_data: updatePDFDetails
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
                    console.log('Status of Pdf saved successfully:', data);
                    fetchAllPdfs()
                    setUpdatePDFDetails([])
                    setSetuploadedFiles([])
                    setDocumentPopupMessage('Successfully Updated PDF Titles!')
                    // Handle success response from the server if needed
                    // navigate(`/choose-pdf/${data.pdf_id}`);
                }
            })
            .catch(error => {
                console.error('Error saving status of PDF:', error);
                // Handle error if the request fails
            });
    }

    const fetchAllPdfs = () => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/get-all-pdf-details`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPdfData(data);
                // console.log(`pdf data is: ${data}`);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchAllPdfs()
    }, [uploadSuccess, refreshFetchAllPDFs]);

    useEffect(() => {
        const filterPDFs = () => {
            const filtered = pdfData.filter(pdf => {
                const fileName = pdf.pdf_file_name && pdf.pdf_id ? pdf.pdf_file_name.toLowerCase() : '';
                const fileTitle = pdf.pdf_title && pdf.pdf_id ? pdf.pdf_title.toLowerCase() : '';
                const fileStatus = pdf.status && pdf.pdf_id ? pdf.status.toLowerCase() : '';
                const pdf_annotated_by = pdf.pdf_annotated_by && pdf.pdf_id ? pdf.annotated_by.toLowerCase() : '';
                const pdf_validated_by = pdf.pdf_validated_by && pdf.pdf_id ? pdf.validated_by.toLowerCase() : '';
                const pdf_chat_history = pdf.pdf_chat_history && pdf.pdf_id ? pdf.chat_history.toLowerCase() : '';
                const pdf_uploaded_by = pdf.pdf_uploaded_by && pdf.pdf_id ? pdf.uploaded_by.toLowerCase() : '';
                return (
                    pdf.pdf_id.toString().includes(searchTerm) ||
                    fileName.includes(searchTerm.toLowerCase()) ||
                    fileTitle.includes(searchTerm.toLowerCase()) ||
                    fileStatus.toString().includes(searchTerm.toLowerCase()) ||
                    pdf_annotated_by.toString().includes(searchTerm.toLowerCase()) ||
                    pdf_validated_by.toString().includes(searchTerm.toLowerCase()) ||
                    pdf_chat_history.toString().includes(searchTerm.toLowerCase()) ||
                    pdf_uploaded_by.toString().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredPDFs(filtered);
        };

        filterPDFs();
    }, [searchTerm, pdfData]);

    const dropdownValue = (searchTerm) => {
        if (searchTerm === 'Available'.toLowerCase()) return 'Available';
        else if (searchTerm === 'Being Worked On'.toLowerCase()) return 'Being Worked On';
        else if (searchTerm === 'Papers to be Approved'.toLowerCase()) return 'Papers to be Approved';
        else if (searchTerm === 'Being Validated'.toLowerCase()) return 'Being Validated';
        else if (searchTerm === 'Completed'.toLowerCase()) return 'Completed';
        else return 'All';
    };

    useEffect(() => {
        // console.log(`orderOfFiles: ${JSON.stringify(orderOfFiles)}`)
    }, [orderOfFiles])
    return (
        <div>
            <div style={{ display: 'flex', width: '100%', marginLeft: '20px' }}>
                {/* Search bar - Top Left*/}
                <div style={{
                    width: (currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator') ? '70%' : '',
                    marginRight: (currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator') ? '' : '40px',
                    display: 'flex',
                }}
                    className="input-group mb-3 mt-3">
                    <div>
                        <span className="input-group-text" id="inputGroup-sizing-default">Search</span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by PDF ID, Name, or Status"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                    />
                    <select
                        style={{
                            marginLeft: '10px',
                            border: '1px solid #ced4da',
                            height: '38px' // Matches the height of the search bar input
                        }}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                        }}
                        value={dropdownValue(searchTerm)}
                    >
                        <option value="">All</option>
                        {(tableState === 'Available Papers' || tableState === 'All Papers') && <option value="Available">Available</option>}
                        {(tableState === 'Your Papers' || tableState === 'All Papers') && <option value="Being Worked On">Being Worked On</option>}
                        {(tableState === 'Your Papers' || tableState === 'Papers to be Approved' || tableState === 'All Papers') && <option value="Being Validated">Being Validated</option>}
                        {(tableState === 'Papers to be Approved' || tableState === 'All Papers') && <option value="Re-Annotation Requested">Re-Annotation Requested</option>}
                        {(tableState === 'Your Papers' || tableState === 'All Papers') && <option value="Revision Needed">Revision Needed</option>}
                        {(tableState === 'Completed Papers' || tableState === 'All Papers') && <option value="Completed">Completed</option>}
                    </select>
                </div>

                {/* PDF Document Upload - Top Right (only for admins and validators)*/}
                {(currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator' || currentSignedInUser.role === 'Annotator') &&
                    <div style={{ width: '30%', marginLeft: '20px', marginRight: '40px' }} className='mt-3 mb-3'>
                        <div style={{ display: 'flex' }}>
                            <input style={{
                                height: '38px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '4px 6px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                backgroundColor: 'green',
                                color: 'white', // text color
                                WebkitAppearance: 'button', // for WebKit browsers
                                MozAppearance: 'button' // for Firefox
                            }}
                                type="file" accept="application/pdf" multiple onChange={handleFileChange} />
                            <button className="btn btn-primary" onClick={() => { openDocumentPreuploadPopupVisibility(); setMessageForPreUpload('') }}>Upload PDFs</button>
                        </div>
                        {uploadSuccess && (
                            <p style={{ color: 'green' }}>
                                {filesUploadedCount > 1
                                    ? `The ${filesUploadedCount} selected files were uploaded successfully!`
                                    : `The selected file was uploaded successfully!`}
                            </p>
                        )}
                        {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
                    </div>
                }
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '20px', marginBottom: '13px' }}>
                <div style={{ color: 'black', marginRight: '20px' }} className="column">
                    <button
                        onClick={() => {
                            if (tableState !== 'Your Papers') {
                                setSearchTerm('');
                                setTableState('Your Papers');
                            }
                        }}
                        className={`btn ${tableState === 'Your Papers' ? 'btn-success' : 'btn-primary'}`}
                    >Your Papers</button>
                </div>
                <div style={{ color: 'black', marginRight: '20px' }} className="column">
                    <button
                        onClick={() => {
                            if (tableState !== 'Available Papers') {
                                setSearchTerm('');
                                setTableState('Available Papers');
                            }
                        }}
                        className={`btn ${tableState === 'Available Papers' ? 'btn-success' : 'btn-primary'}`}
                    >Available Papers</button>
                </div>
                <div style={{ color: 'black', marginRight: '20px' }} className="column">
                    <button
                        onClick={() => {
                            if (tableState !== 'Completed Papers') {
                                setSearchTerm('');
                                setTableState('Completed Papers');
                            }
                        }}
                        className={`btn ${tableState === 'Completed Papers' ? 'btn-success' : 'btn-primary'}`}
                    >Completed Papers</button>
                </div>
                {(currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator') && <div style={{ color: 'black', marginRight: '20px' }} className="column">
                    <button
                        onClick={() => {
                            if (tableState !== 'All Papers') {
                                setSearchTerm('');
                                setTableState('All Papers');
                            }
                        }}
                        className={`btn ${tableState === 'All Papers' ? 'btn-success' : 'btn-primary'}`}
                    >All Papers</button>
                </div>
                }
                {(currentSignedInUser.role === 'Admin' || currentSignedInUser.role === 'Validator') && <div style={{ color: 'black' }} className="column">
                    <button
                        onClick={() => {
                            if (tableState !== 'Papers to be Approved') {
                                setSearchTerm('');
                                setTableState('Papers to be Approved');
                            }
                        }}
                        className={`btn ${tableState === 'Papers to be Approved' ? 'btn-success' : 'btn-primary'}`}
                    >Papers to be Approved</button>
                </div>
                }
            </div>

            {uploadDocumentPopupVisibility && (
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
                    <div className="card" style={{ width: documentPopupMessage === '' ? '60rem' : '26rem' }}>
                        <div className="card-body" style={{ overflowY: 'auto' }} onScroll={e => e.stopPropagation()}>
                            {documentPopupMessage === ''
                                ? <h4 style={{ textAlign: 'center' }} className="card-title">Do you want to add a title for your PDFs?</h4>
                                : <h4 style={{ textAlign: 'center', color: 'green' }} className="card-title">{documentPopupMessage}</h4>}

                            <div className="chat-history" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                {documentPopupMessage === '' && <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">PDF ID</th>
                                            <th scope="col">PDF File Name</th>
                                            <th scope="col">PDF Title</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadedFiles.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.pdf_id}</td>
                                                <td>{item.pdf_file_name}</td>
                                                <td>
                                                    <input
                                                        onChange={(event) => setUpdatePDFDetails(prev => {
                                                            // Check if the pdf_id already exists
                                                            const exists = prev.some(pdf => pdf.pdf_id === item.pdf_id);

                                                            // If it exists, update the existing object
                                                            if (exists) {
                                                                return prev.map(pdf =>
                                                                    pdf.pdf_id === item.pdf_id
                                                                        ? { ...pdf, pdf_title: event.target.value }
                                                                        : pdf
                                                                );
                                                            }

                                                            // If it doesn't exist, add a new object
                                                            return [...prev, { pdf_id: item.pdf_id, pdf_title: event.target.value }];
                                                        })}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}
                            </div>
                            {documentPopupMessage === ''
                                ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button className="btn btn-success" style={{ marginRight: '10px' }} onClick={handleUpdatePdfDetails}>Update Titles</button>
                                    <button className="btn btn-danger" onClick={() => { closeUploadDocumentPopupVisibility(); setDocumentPopupMessage(''); setSetuploadedFiles([]) }}>Close</button>
                                </div>
                                : <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button className="btn btn-success" onClick={() => { closeUploadDocumentPopupVisibility(); setDocumentPopupMessage(''); }}>Okay</button>
                                </div>
                            }
                        </div>
                    </div>

                </div>
            )
            }


            {documentPreuploadPopupVisibility && (
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
                    <div className="card" style={{ width: documentPopupMessage === '' ? '60rem' : '26rem' }}>
                        <div className="card-body" style={{ overflowY: 'auto' }} onScroll={e => e.stopPropagation()}>
                            <h4 style={{ textAlign: 'center' }} className="card-title"><u>Your Selected PDFs</u></h4>
                            <h5 style={{ textAlign: 'center' }} className="card-title">Enter the list of indices <u><b>in the order</b></u> that you want them merged. Make sure to include the index of the main paper that you are on.</h5>
                            <div className="chat-history" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope='col'>Index</th>
                                            <th scope="col">PDF File Name</th>
                                            <th scope="col">Merge</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from(selectedFiles).map((file, index) => (
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>{file.name}</td>
                                                <td>
                                                    <input
                                                        value={inputValues[index] || ''}
                                                        disabled={orderOfFiles.some(arr => arr.includes(index))}
                                                        onChange={(event) => {
                                                            const inputValue = event.target.value;

                                                            // Restrict input to numbers and commas only
                                                            const sanitizedInputValue = inputValue.replace(new RegExp(`[^0-${selectedFiles.length - 1},]`, 'g'), '');

                                                            // Automatically add a comma after each number
                                                            const formattedValue = sanitizedInputValue.replace(/(\d)(?=\d)/g, '$1,');

                                                            // Update the input value state with formatted value
                                                            setInputValues(prevValues => ({ ...prevValues, [index]: formattedValue }));

                                                            // Extract numbers from formatted value, filter out NaN and duplicates
                                                            const numberArray = formattedValue.split(',')
                                                                .map(Number)
                                                                .filter(num => !isNaN(num))
                                                                .filter((num, idx, self) => self.indexOf(num) === idx); // Filter duplicates

                                                            // Check if current index is included in any orderOfFiles array
                                                            const isIndexIncluded = numberArray.includes(index);

                                                            // Check if there are common numbers between numberArray and orderOfFiles arrays
                                                            if (isIndexIncluded && !hasCommonNumberInTwoArrays(numberArray, orderOfFiles)) {
                                                                setCurrentInputForMerge(numberArray);
                                                            } else {
                                                                setCurrentInputForMerge(false);
                                                            }
                                                        }}
                                                        onKeyDown={(event) => {
                                                            // Prevent non-digit keys (allow backspace, delete, arrow keys, etc.)
                                                            if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                        // onBlur={() => {
                                                        //     setInputValues(prevValues => ({ ...prevValues, [index]: '' }));
                                                        //     setCurrentInputForMerge(false); // Clear the state when input is cleared
                                                        // }}
                                                        onFocus={() => {
                                                            // Clear all input fields except the current one
                                                            setInputValues({});
                                                            setCurrentInputForMerge(false);
                                                        }}
                                                    />


                                                    {inputValues[index] && (<button style={{ marginLeft: '10px' }} className='btn btn-primary' onClick={() => {
                                                        if (currentInputForMerge !== false) {
                                                            setMessageForPreUpload('')
                                                            setOrderOfFiles(prevOrder => [...prevOrder, currentInputForMerge]);
                                                        } else {
                                                            setMessageForPreUpload(
                                                                <>
                                                                    Failed to merge.<br />
                                                                    1) Make sure you haven't used the PDF already<br />
                                                                    2) The textbox that you are entering the indices must have its own index as well
                                                                </>
                                                            );

                                                        }
                                                    }}>merge</button>)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p style={{ color: 'red' }}>{messageForPreUpload}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                <button className="btn btn-success" style={{ marginRight: '10px' }} onClick={handleSubmitPDFUpload}>Upload PDFs</button>
                                <button className="btn btn-danger" onClick={() => { setOrderOfFiles([]); setCurrentInputForMerge([]); closeDocumentPreuploadPopupVisibility(); }}>Close</button>
                            </div>
                        </div>
                    </div>

                </div>
            )
            }

            {/* List of PDFs */}
            <CurrentListOfTablePDFsContext.Provider value={[refreshFetchAllPDFs, setRefreshFetchAllPDFs]}>
                <TableOfPDFs filteredPDFs={filteredPDFs} onPdfSelect={onPdfSelect} navigate={navigate} tableState={tableState} />
            </CurrentListOfTablePDFsContext.Provider>

        </div >
    );
};

export default ChooseAPdf;
