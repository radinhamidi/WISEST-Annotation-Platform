import pdfToText from 'react-pdftotext';

export async function extractDOI(file) {
    try {
        const text = await pdfToText(file);
        const doi = extractActualDOI(text);
        if (doi) {
            console.log("Extracted DOI:", doi);
            return doi;
        } else {
            console.log("DOI not found");
            return null;
        }
    } catch (error) {
        console.error("Failed to extract text from pdf", error);
        throw error; // Rethrow the error to handle it further if needed
    }
}

function extractActualDOI(text) {
    const doiPattern = /\b10\.\d{4,9}\/[-._;()\/:A-Z0-9]+\b/i;
    const match = text.match(doiPattern);
    return match ? match[0] : null;
}


// function PDFParserReact() {
//     return (
//         <div className="App">
//             <header className="App-header">
//                 <input type="file" accept="application/pdf" onChange={extractText}/>
//             </header>
//         </div>
//     );
// }

// export default PDFParserReact;
