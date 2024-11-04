//Directly add highlight by selecting text
import React, { useState, useEffect, useRef } from 'react';
import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
import { Spinner } from './Spinner';
import { Sidebar } from './Sidebar';
import '../../Styles/style.css';
import { testHighlights as _testHighlights } from './test-highlights';
import Questions from './Questions';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/authentication';

const testHighlights = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);

const resetHash = () => document.location.hash = '';

const HighlightPopup = ({ comment }) => null;
// comment.text ? (
//   <div className="Highlight__popup">
//     {comment.emoji} {comment.text}
//   </div>
// ) : null;

const fetchPdf = async (pdfId) => {
  try {
    //console.log(`current pdf id ${pdfId}`)
    const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/retrieve-pdf-file/${pdfId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }
    const pdfBlob = await response.blob();
    const url = URL.createObjectURL(pdfBlob);
    return url;
  } catch (error) {
    console.error('Error fetching PDF:', error);
  }
};

const Annotator = () => {
  const { pdfId } = useParams();
  const [url, setUrl] = useState(null);
  const [highlights, setHighlights] = useState([]);

  const scrollViewerToRef = useRef(null);

  const resetHighlights = () => {
    //console.log(highlights);
    setHighlights([]);
  };

  const toggleDocument = () => {
    // Toggle between the URLs if needed
  };

  const scrollToHighlightFromHash = () => {
    // Code to scroll to the highlight from hash
  };

  useEffect(() => {
    const loadPdf = async () => {
      const pdfUrl = await fetchPdf(pdfId);
      setUrl(pdfUrl);
    };
    loadPdf();
  }, [pdfId]);

  const addHighlight = (highlight) => {
    //console.log('Saving highlight', highlight);
    setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
  };

  const updateHighlight = (highlightId, position, content) => {
    //console.log('Updating highlight', highlightId, position, content);
    setHighlights(
      highlights.map((h) => {
        const { id, position: originalPosition, content: originalContent, ...rest } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      })
    );
  };

  const renderPdfHighlighter = (pdfDocument) => (
    <PdfHighlighter
      pdfDocument={pdfDocument}
      enableAreaSelection={(event) => event.altKey}
      onScrollChange={resetHash}
      scrollRef={(scrollTo) => {
        scrollViewerToRef.current = scrollTo;
        scrollToHighlightFromHash();
      }}
      onSelectionFinished={(
        position,
        content,
        hideTipAndSelection
      ) => {
        addHighlight({ content, position, comment: {} });
        hideTipAndSelection();
      }}
      highlightTransform={(
        highlight,
        index,
        setTip,
        hideTip,
        viewportToScaled,
        screenshot,
        isScrolledTo
      ) => {
        const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

        const component = isTextHighlight ? (
          <Highlight
            isScrolledTo={isScrolledTo}
            position={highlight.position}
            comment={highlight.comment}
          />
        ) : (
          <AreaHighlight
            isScrolledTo={isScrolledTo}
            highlight={highlight}
            onChange={(boundingRect) => {
              updateHighlight(
                highlight.id,
                { boundingRect: viewportToScaled(boundingRect) },
                { image: screenshot(boundingRect) }
              );
            }}
          />
        );

        return (
          <Popup
            popupContent={<HighlightPopup {...highlight} />}
            onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
            onMouseOut={hideTip}
            key={index}
            children={component}
          />
        );
      }}
      highlights={highlights}
    />
  );

  return (
    <div style={{ display: 'flex', height: '93vh', position: '' }}>
      <div style={{ flex: '65%', backgroundColor: 'lightblue', overflow: 'auto', position: 'relative', width: '100%' }}>
        {url && (
          <>
            <PdfLoader url={url} beforeLoad={<Spinner />}>
              {(pdfDocument) => renderPdfHighlighter(pdfDocument)}
            </PdfLoader>
          </>
        )}
      </div>
      <div style={{ flex: '35%', overflow: 'auto' }}>
        <Questions pdfId={pdfId} AllHighlights={highlights} />
      </div>
    </div>
  );
};

export default Annotator;
{/* <Sidebar
  style={{}}
  highlights={highlights}
  resetHighlights={resetHighlights}
  toggleDocument={toggleDocument}
  updateQuoteFromSRTextbox={updateQuoteFromSRTextbox}
/> */}



// import React, { useState, useEffect, useRef } from 'react';
// import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
// import { Spinner } from './Spinner';
// import { Sidebar } from './Sidebar';
// import '../../Styles/style.css';
// import { testHighlights as _testHighlights } from './test-highlights';
// import Questions from './Questions';
// import { useNavigate, useParams } from 'react-router-dom';

// const testHighlights = _testHighlights;

// const getNextId = () => String(Math.random()).slice(2);

// const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);

// const resetHash = () => document.location.hash = '';

// const HighlightPopup = ({ comment }) => null;
// // comment.text ? (
// //   <div className="Highlight__popup">
// //     {comment.emoji} {comment.text}
// //   </div>
// // ) : null;

// const fetchPdf = async (pdfId) => {
//   try {
//     //console.log(`current pdf id ${pdfId}`)
//     const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/retrieve-pdf-file/${pdfId}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch PDF');
//     }
//     const pdfBlob = await response.blob();
//     const url = URL.createObjectURL(pdfBlob);
//     return url;
//   } catch (error) {
//     console.error('Error fetching PDF:', error);
//   }
// };

// const Annotator = () => {
//   const { pdfId } = useParams();
//   const [url, setUrl] = useState(null);
//   const [highlights, setHighlights] = useState([]);
//   const [selectionPopup, setSelectionPopup] = useState(null);

//   const scrollViewerToRef = useRef(null);
//   const popupRef = useRef(null);

//   const resetHighlights = () => {
//     //console.log(highlights);
//     setHighlights([]);
//   };

//   const toggleDocument = () => {
//     // Toggle between the URLs if needed
//   };

//   const scrollToHighlightFromHash = () => {
//     // Code to scroll to the highlight from hash
//   };

//   useEffect(() => {
//     const loadPdf = async () => {
//       const pdfUrl = await fetchPdf(pdfId);
//       setUrl(pdfUrl);
//     };
//     loadPdf();
//   }, [pdfId]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setSelectionPopup(null);
//       }
//     };

//     if (selectionPopup) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [selectionPopup]);

//   const addHighlight = (highlight) => {
//     //console.log('Saving highlight', highlight);
//     setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
//   };

//   const updateHighlight = (highlightId, position, content) => {
//     //console.log('Updating highlight', highlightId, position, content);
//     setHighlights(
//       highlights.map((h) => {
//         const { id, position: originalPosition, content: originalContent, ...rest } = h;
//         return id === highlightId
//           ? {
//               id,
//               position: { ...originalPosition, ...position },
//               content: { ...originalContent, ...content },
//               ...rest,
//             }
//           : h;
//       })
//     );
//   };

//   const renderPdfHighlighter = (pdfDocument) => (
//     <PdfHighlighter
//       pdfDocument={pdfDocument}
//       enableAreaSelection={(event) => event.altKey}
//       onScrollChange={resetHash}
//       scrollRef={(scrollTo) => {
//         scrollViewerToRef.current = scrollTo;
//         scrollToHighlightFromHash();
//       }}
//       onSelectionFinished={(
//         position,
//         content,
//         hideTipAndSelection,
//         transformSelection
//       ) => {
//         const selection = window.getSelection();
//         if (selection.rangeCount > 0) {
//           const range = selection.getRangeAt(0);
//           const rect = range.getBoundingClientRect();
//           if (rect) {
//             const cursorPosition = { top: rect.top, left: rect.left };
//             setSelectionPopup({
//               position,
//               content,
//               hideTipAndSelection,
//               cursorPosition,
//             });
//           }
//         }
//       }}
//       highlightTransform={(
//         highlight,
//         index,
//         setTip,
//         hideTip,
//         viewportToScaled,
//         screenshot,
//         isScrolledTo
//       ) => {
//         const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

//         const component = isTextHighlight ? (
//           <Highlight
//             isScrolledTo={isScrolledTo}
//             position={highlight.position}
//             comment={highlight.comment}
//           />
//         ) : (
//           <AreaHighlight
//             isScrolledTo={isScrolledTo}
//             highlight={highlight}
//             onChange={(boundingRect) => {
//               updateHighlight(
//                 highlight.id,
//                 { boundingRect: viewportToScaled(boundingRect) },
//                 { image: screenshot(boundingRect) }
//               );
//             }}
//           />
//         );

//         return (
//           <Popup
//             popupContent={<HighlightPopup {...highlight} />}
//             onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
//             onMouseOut={hideTip}
//             key={index}
//             children={component}
//           />
//         );
//       }}
//       highlights={highlights}
//     />
//   );

//   return (
//     <div style={{ display: 'flex', height: '93vh', position: 'absolute' }}>
//       <div style={{ flex: '65%', backgroundColor: 'lightblue', overflow: 'auto', position: 'relative' }}>
//         {url && (
//           <>
//             <PdfLoader url={url} beforeLoad={<Spinner />}>
//               {(pdfDocument) => renderPdfHighlighter(pdfDocument)}
//             </PdfLoader>
//           </>
//         )}
//         {selectionPopup && (
//           <div
//             ref={popupRef}
//             style={{
//               position: 'absolute',
//               top: selectionPopup.cursorPosition.top + window.scrollY,
//               left: selectionPopup.cursorPosition.left + window.scrollX,
//               // backgroundColor: 'white',
//               // border: '1px solid black',
//               zIndex: 10,
//               padding: '5px',
//             }}
//           >
//             <button
//               className='btn btn-success'
//               onClick={() => {
//                 addHighlight({ content: selectionPopup.content, position: selectionPopup.position, comment: {} });
//                 selectionPopup.hideTipAndSelection();
//                 setSelectionPopup(null);
//               }}
//             >
//               Add Highlight
//             </button>
//           </div>
//         )}
//       </div>
//       <div style={{ marginTop: '5px', flex: '35%', overflow: 'auto' }}>
//         <Questions pdfId={pdfId} AllHighlights={highlights} />
//       </div>
//     </div>
//   );
// };

// export default Annotator;






{/* <Sidebar
  style={{}}
  highlights={highlights}
  resetHighlights={resetHighlights}
  toggleDocument={toggleDocument}
  updateQuoteFromSRTextbox={updateQuoteFromSRTextbox}
/> */}



