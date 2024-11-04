// import React, { useState } from 'react';

// const UploadForm = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadError, setUploadError] = useState('');

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('pdf', selectedFile);

//     try {
//       const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/upload-pdf`, {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       setUploadSuccess(true);
//       setUploadError('');
//       console.log('File uploaded successfully:', result);
//     } catch (error) {
//       setUploadSuccess(false);
//       setUploadError('Error uploading file. Please try again.');
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <div style={{height: '38px'}}>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept="application/pdf" onChange={handleFileChange} />
//         <button type="submit">Upload PDF</button>
//       </form>
//       {uploadSuccess && <p>File uploaded successfully!</p>}
//       {uploadError && <p>{uploadError}</p>}
//     </div>
//   );
// };

// export default UploadForm;
