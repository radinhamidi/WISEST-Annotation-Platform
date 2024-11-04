import React, { useState, useEffect, useContext, useRef } from 'react';
import { CurrentSignedInUserContext } from '../../App';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/authentication';

const Questions = ({ AllHighlights, pdfId }) => {

    const [questions, setQuestions] = useState([]);
    const [currentSignedInUser, setCurrentSignedInUser] = useContext(CurrentSignedInUserContext)
    const [currentTextboxValue, setCurrentTextboxValue] = useState('')
    const [quoteFromSRAnswers, setQuoteFromSrAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState('')
    const [chatPopupVisibility, setChatPopupVisibility] = useState(false)
    const [currentPdfData, setCurrentPdfData] = useState({})
    const [chatboxValue, setChatboxValue] = useState('')
    const [chatHistory, setChatHistory] = useState('')
    const [saveQuestionsConfirmPopup, setSaveQuestionsConfirmPopup] = useState(false)
    const [currentAnswers, setCurrentAnswers] = useState([])
    const [revisionPermissionPopup, setRevisionPermissionPopup] = useState(false)
    const [requestForRevisionPopup, setRequestForRevisionPopup] = useState(false)
    const [paperApprovedPopup, setPaperApprovedPopup] = useState(false)
    const [paperRejectedPopup, setPaperRejectedPopup] = useState(false)
    const [checkboxState, setCheckboxState] = useState({});
    const navigate = useNavigate()

    const openPaperRejectedPopup = () => {
        closePaperApprovedPopup()
        closeChatPopup()
        closeRevisionPermissionPopup()
        closeRequestForRevisionPopup()
        setPaperRejectedPopup(true)
    }

    const closePaperRejectedPopup = () => {
        setPaperRejectedPopup(false)
    }

    const openPaperApprovedPopup = () => {
        closePaperRejectedPopup()
        closeChatPopup()
        closeRevisionPermissionPopup()
        closeRequestForRevisionPopup()
        setPaperApprovedPopup(true)
    }

    const closePaperApprovedPopup = () => {
        setPaperApprovedPopup(false)
    }

    const openChatPopup = () => {
        closePaperRejectedPopup()
        closePaperApprovedPopup()
        closeRevisionPermissionPopup()
        closeRequestForRevisionPopup()
        setChatPopupVisibility(true)
    }

    const closeChatPopup = () => {
        setChatPopupVisibility(false)
    }

    const openRevisionPermissionPopup = () => {
        closePaperRejectedPopup()
        closePaperApprovedPopup()
        closeChatPopup()
        closeRequestForRevisionPopup()
        setRevisionPermissionPopup(true)
    }

    const closeRevisionPermissionPopup = () => {
        setRevisionPermissionPopup(false)
    }

    const openRequestForRevisionPopup = () => {
        closePaperRejectedPopup()
        closePaperApprovedPopup()
        closeChatPopup()
        closeRevisionPermissionPopup()
        setRequestForRevisionPopup(true)
    }

    const closeRequestForRevisionPopup = () => {
        setRequestForRevisionPopup(false)
    }


    const handleFocusClick = (index, pdfstatus) => {
        if (pdfstatus === 'Available' || pdfstatus === 'Completed') return

        setCurrentIndex(index)
        setQuoteFromSrAnswers({
            0: (questions[0] && questions[0].quote_from_sr) ? questions[0].quote_from_sr : '',
            1: (questions[1] && questions[1].quote_from_sr) ? questions[1].quote_from_sr : '',
            2: (questions[2] && questions[2].quote_from_sr) ? questions[2].quote_from_sr : '',
            3: (questions[3] && questions[3].quote_from_sr) ? questions[3].quote_from_sr : '',
            4: (questions[4] && questions[4].quote_from_sr) ? questions[4].quote_from_sr : '',
            5: (questions[5] && questions[5].quote_from_sr) ? questions[5].quote_from_sr : '',
            6: (questions[6] && questions[6].quote_from_sr) ? questions[6].quote_from_sr : '',
            7: (questions[7] && questions[7].quote_from_sr) ? questions[7].quote_from_sr : '',
            8: (questions[8] && questions[8].quote_from_sr) ? questions[8].quote_from_sr : '',
            9: (questions[9] && questions[9].quote_from_sr) ? questions[9].quote_from_sr : '',
            10: (questions[10] && questions[10].quote_from_sr) ? questions[10].quote_from_sr : '',
            11: (questions[11] && questions[11].quote_from_sr) ? questions[11].quote_from_sr : '',
            12: (questions[12] && questions[12].quote_from_sr) ? questions[12].quote_from_sr : '',
            13: (questions[13] && questions[13].quote_from_sr) ? questions[13].quote_from_sr : '',
            14: (questions[14] && questions[14].quote_from_sr) ? questions[14].quote_from_sr : '',
            15: (questions[15] && questions[15].quote_from_sr) ? questions[15].quote_from_sr : '',
            16: (questions[16] && questions[16].quote_from_sr) ? questions[16].quote_from_sr : '',
            17: (questions[17] && questions[17].quote_from_sr) ? questions[17].quote_from_sr : '',
            18: (questions[18] && questions[18].quote_from_sr) ? questions[18].quote_from_sr : '',
            19: (questions[19] && questions[19].quote_from_sr) ? questions[19].quote_from_sr : '',
            20: (questions[20] && questions[20].quote_from_sr) ? questions[20].quote_from_sr : '',
            21: (questions[21] && questions[21].quote_from_sr) ? questions[21].quote_from_sr : '',
            22: (questions[22] && questions[22].quote_from_sr) ? questions[22].quote_from_sr : '',
            23: (questions[23] && questions[23].quote_from_sr) ? questions[23].quote_from_sr : '',
            24: (questions[24] && questions[24].quote_from_sr) ? questions[24].quote_from_sr : '',
            25: (questions[25] && questions[25].quote_from_sr) ? questions[25].quote_from_sr : '',
            26: (questions[26] && questions[26].quote_from_sr) ? questions[26].quote_from_sr : '',
            27: (questions[27] && questions[27].quote_from_sr) ? questions[27].quote_from_sr : '',
            28: (questions[28] && questions[28].quote_from_sr) ? questions[28].quote_from_sr : '',
            29: (questions[29] && questions[29].quote_from_sr) ? questions[29].quote_from_sr : '',
            30: (questions[30] && questions[30].quote_from_sr) ? questions[30].quote_from_sr : '',
            31: (questions[31] && questions[31].quote_from_sr) ? questions[31].quote_from_sr : '',
            32: (questions[32] && questions[32].quote_from_sr) ? questions[32].quote_from_sr : '',
            33: (questions[33] && questions[33].quote_from_sr) ? questions[33].quote_from_sr : '',
            34: (questions[34] && questions[34].quote_from_sr) ? questions[34].quote_from_sr : '',
            35: (questions[35] && questions[35].quote_from_sr) ? questions[35].quote_from_sr : '',
            36: (questions[36] && questions[36].quote_from_sr) ? questions[36].quote_from_sr : '',
            37: (questions[37] && questions[37].quote_from_sr) ? questions[37].quote_from_sr : '',
            38: (questions[38] && questions[38].quote_from_sr) ? questions[38].quote_from_sr : '',
            39: (questions[39] && questions[39].quote_from_sr) ? questions[39].quote_from_sr : '',
            40: (questions[40] && questions[40].quote_from_sr) ? questions[40].quote_from_sr : '',
            41: (questions[41] && questions[41].quote_from_sr) ? questions[41].quote_from_sr : '',
            42: (questions[42] && questions[42].quote_from_sr) ? questions[42].quote_from_sr : '',
            43: (questions[43] && questions[43].quote_from_sr) ? questions[43].quote_from_sr : '',

        })
        if (currentTextboxValue !== '') {
            setQuoteFromSrAnswers(prevState => ({
                ...prevState,
                [index]: (prevState[index] ? prevState[index] + '\n' : '') + currentTextboxValue

            }))
        }
        setCurrentTextboxValue('')
        // //console.log(`testing questions here first: ${JSON.stringify(questions[0])}`)
    };



    useEffect(() => {
        if (AllHighlights && AllHighlights[0] && AllHighlights[0].content && AllHighlights[0].content.text) {
            // //console.log(`AllHighlights[0]: ${AllHighlights[0].content.text}`)
            setCurrentTextboxValue(AllHighlights[0].content.text)
        }
    }, [AllHighlights])

    useEffect(() => {
        answerOrUpdateQuestion(quoteFromSRAnswers[currentIndex], currentIndex, 'quote_from_sr');
        // //console.log(`change in quotefromsr ${quoteFromSRAnswers[0]}`)
    }, [quoteFromSRAnswers])

    // useEffect(() => {
    //     //console.log(`change in questions ${JSON.stringify(questions[0])}`)
    // }, [questions])

    useEffect(() => {
        setChatHistory(currentPdfData.chat_history)
    }, [currentPdfData])

    const answerOrUpdateQuestion = (e, i, question_to_answer) => {
        const propertyMap = {
            'robis_responses': 'robis_responses',
            'amstar_2_responses': 'amstar_2_responses',
            'agreement_or_not': 'agreement_or_not',
            'clarity_of_evidence': 'clarity_of_evidence',
            'quote_from_sr': 'quote_from_sr',
            'rationale': 'rationale',
            'has_quote_from_sr': 'has_quote_from_sr'
        };

        setQuestions(prevQuestions => {
            return prevQuestions.map((question, index) => {
                if (index === i && propertyMap.hasOwnProperty(question_to_answer)) {
                    return {
                        ...question,
                        [propertyMap[question_to_answer]]: e.target ? e.target.value : e
                    };
                }
                return question;
            });
        });
    }

    const handleRejectRevision = async (status) => {

        try {
            const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/reject-revision-request/${pdfId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pdf_id: pdfId,
                    status: status,
                    validated_by: currentSignedInUser.email
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            //console.log('Success:', data.message); // Log success message from backend

            // Handle any further actions upon successful update
            // For example, you can trigger UI updates or show a success message
        } catch (error) {
            console.error('Error updating reannotation status:', error.message);
            // Handle errors - e.g., display an error message to the user
        }
    };


    const handleSaveQuestions = (question_status) => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/save-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questions: questions,
                status: question_status,
                pdf_id: questions.pdf_id
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                //console.log('Questions saved successfully:', data);
                retrievePDFDetails(pdfId)
                //console.log(`the status before needed: ${currentPdfData.status}`)
            })
            .catch(error => {
                console.error('Error saving questions:', error);
                // Handle error if the request fails
            });
    };

    const handleRequestToRevise = (pdf_status) => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/request-to-revise`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pdf_id: currentPdfData.pdf_id,
                status: pdf_status,
                chat_history: `${chatboxValue === '' ? '' : `${chatHistory ? chatHistory : ''}${currentSignedInUser.name}: ${chatboxValue}——new line——`}`,
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
                    //console.log('Request for Re-Annotation made successfully:', data);
                    navigate('/choose-pdf')
                }
            })
            .catch(error => {
                console.error('Error making request for Re-Annotation:', error);
                // Handle error if the request fails
            });
    }

    const handleSubmitQuestions = () => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/submit-for-validation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questions: questions,
                chat_history: `${chatboxValue === '' ? '' : `${chatHistory ? chatHistory : ''}${currentSignedInUser.name}: ${chatboxValue}——new line——`}`,
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

                    // //console.log('Questions saved successfully:', data);
                    navigate('/choose-pdf')
                }
                // Handle success response from the server if needed
            })
            .catch(error => {
                console.error('Error saving questions:', error);
                // Handle error if the request fails
            });
    }

    const handlePermissionToReEditPaper = (pdf_status) => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/grant-permission-to-reEdit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pdf_id: currentPdfData.pdf_id,
                status: pdf_status,
                chat_history: `${chatboxValue === '' ? '' : `${chatHistory ? chatHistory : ''}${currentSignedInUser.name}: ${chatboxValue}——new line——`}`,
                validated_by: currentSignedInUser.email
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
                    //console.log('Request for Re-Annotation made successfully:', data);
                    navigate('/choose-pdf')
                }
            })
            .catch(error => {
                console.error('Error making request for Re-Annotation:', error);
                // Handle error if the request fails
            });
    }

    const handleRequestForReAnnotation = (pdf_status) => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/request-for-reannotation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pdf_id: currentPdfData.pdf_id,
                status: pdf_status,
                chat_history: `${chatboxValue === '' ? '' : `${chatHistory ? chatHistory : ''}${currentSignedInUser.name}: ${chatboxValue}——new line——`}`,
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
                    // //console.log('Request for Re-Annotation made successfully:', data);
                    navigate('/choose-pdf')
                }
            })
            .catch(error => {
                console.error('Error making request for Re-Annotation:', error);
                // Handle error if the request fails
            });
    }

    const handleValidatorStatus = () => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/update-validator-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pdf_id: currentPdfData.pdf_id,
                validated_by: currentSignedInUser.email
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
                    // //console.log('Request for Re-Annotation made successfully:', data);
                }
            })
            .catch(error => {
                console.error('Error making request:', error);
                // Handle error if the request fails
            });
    }

    const retrievePDFDetails = (pdfID) => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/retrieve-pdf-details/${pdfId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not okay')
                }
                return response.json()
            })
            .then(data => {
                setCurrentPdfData(data[0])
                // //console.log(`pdf data from Questions page is: ${JSON.stringify(data[0])}`)
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        retrievePDFDetails(pdfId)
    }, [pdfId])

    useEffect(() => {
        fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/retrieve-specific-pdf-answers/${pdfId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not okay')
                }
                return response.json()
            })
            .then(data => {
                setCurrentAnswers(data)
                // //console.log(`Answers are: ${JSON.stringify(data)}`)
            })
            .catch(error => {
                console.error(error)
            })
    }, [pdfId])

    useEffect(() => {
        const questionNumbers = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16',
            '1.1', '1.2', '1.3', '1.4', '1.5', '1.6',
            '2.1', '2.2', '2.3', '2.4', '2.5', '2.6',
            '3.1', '3.2', '3.3', '3.4', '3.5', '3.6',
            '4.1', '4.2', '4.3', '4.4', '4.5', '4.6',
            'A', 'B', 'C', 'Overall Judgment'
        ];

        const answers_obj = {};
        questionNumbers.forEach(number => {
            answers_obj[number] = currentAnswers.length > 0 ? currentAnswers.find(answer => answer.question_number === number) : ''
        })
        // setAnswersFinderObj(answers_obj)
        // //console.log(`answers_obj is: ${JSON.stringify(answers_obj['1.1'].robis_responses)}`)
        setQuestions([
            {
                question_id: '17',
                question_number: '1.1',
                question_text: 'Did the review adhere to pre-defined objectives and eligibility criteria?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['1.1'].robis_responses || '',
                amstar_2_responses: answers_obj['1.1'].amstar_2_responses || '',
                agreement_or_not: answers_obj['1.1'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['1.1'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['1.1'].quote_from_sr || '',
                rationale: answers_obj['1.1'].rationale || '',
                has_quote_from_sr: answers_obj['1.1'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '2',
                question_number: '2',
                question_text: 'Did the report of the review contain an explicit statement that the review methods were established prior to the conduct of the review and did the report justify any significant deviations from the protocol?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['2'].robis_responses || '',
                amstar_2_responses: answers_obj['2'].amstar_2_responses || '',
                agreement_or_not: answers_obj['2'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['2'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['2'].quote_from_sr || '',
                rationale: answers_obj['2'].rationale || '',
                has_quote_from_sr: answers_obj['2'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '18',
                question_number: '1.2',
                question_text: 'Were the eligibility criteria appropriate for the review question?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['1.2'].robis_responses || '',
                amstar_2_responses: answers_obj['1.2'].amstar_2_responses || '',
                agreement_or_not: answers_obj['1.2'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['1.2'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['1.2'].quote_from_sr || '',
                rationale: answers_obj['1.2'].rationale || '',
                has_quote_from_sr: answers_obj['1.2'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '19',
                question_number: '1.3',
                question_text: 'Were eligibility criteria unambiguous?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['1.3'].robis_responses || '',
                amstar_2_responses: answers_obj['1.3'].amstar_2_responses || '',
                agreement_or_not: answers_obj['1.3'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['1.3'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['1.3'].quote_from_sr || '',
                rationale: answers_obj['1.3'].rationale || '',
                has_quote_from_sr: answers_obj['1.3'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '1',
                question_number: '1',
                question_text: 'Did the research questions and inclusion criteria for the review include the components of PICO?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['1'].robis_responses || '',
                amstar_2_responses: answers_obj['1'].amstar_2_responses || '',
                agreement_or_not: answers_obj['1'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['1'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['1'].quote_from_sr || '',
                rationale: answers_obj['1'].rationale || '',
                has_quote_from_sr: answers_obj['1'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '3',
                question_number: '3',
                question_text: 'Did the review authors explain their selection of the study designs for inclusion in the review?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['3'].robis_responses || '',
                amstar_2_responses: answers_obj['3'].amstar_2_responses || '',
                agreement_or_not: answers_obj['3'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['3'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['3'].quote_from_sr || '',
                rationale: answers_obj['3'].rationale || '',
                has_quote_from_sr: answers_obj['3'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '20',
                question_number: '1.4',
                question_text: 'Were all restrictions in eligibility criteria based on date, sample size, study quality, outcomes measured appropriate (i.e. certain study characteristics)? If yes, indicate which study characteristic was an inclusion/exclusion criteria',
                form_label: 'ROBIS',
                robis_responses: answers_obj['1.4'].robis_responses || '',
                amstar_2_responses: answers_obj['1.4'].amstar_2_responses || '',
                agreement_or_not: answers_obj['1.4'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['1.4'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['1.4'].quote_from_sr || '',
                rationale: answers_obj['1.4'].rationale || '',
                has_quote_from_sr: answers_obj['1.4'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '21',
                question_number: '1.5',
                question_text: 'Were any restrictions in eligibility criteria based on publication status or format, language, availability of data appropriate (i.e. sources of information)?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['1.5'].robis_responses || '',
                amstar_2_responses: answers_obj['1.5'].amstar_2_responses || '',
                agreement_or_not: answers_obj['1.5'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['1.5'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['1.5'].quote_from_sr || '',
                rationale: answers_obj['1.5'].rationale || '',
                has_quote_from_sr: answers_obj['1.5'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '22',
                question_number: '1.6',
                question_text: 'Concerns regarding specification of eligibility criteria (low, high, unclear)',
                form_label: 'ROBIS',
                robis_responses: answers_obj['1.6'].robis_responses || '',
                amstar_2_responses: answers_obj['1.6'].amstar_2_responses || '',
                agreement_or_not: answers_obj['1.6'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['1.6'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['1.6'].quote_from_sr || '',
                rationale: answers_obj['1.6'].rationale || '',
                has_quote_from_sr: answers_obj['1.6'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '23',
                question_number: '2.1',
                question_text: 'Did the search include an appropriate range of databases/electronic sources for published and unpublished reports?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['2.1'].robis_responses || '',
                amstar_2_responses: answers_obj['2.1'].amstar_2_responses || '',
                agreement_or_not: answers_obj['2.1'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['2.1'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['2.1'].quote_from_sr || '',
                rationale: answers_obj['2.1'].rationale || '',
                has_quote_from_sr: answers_obj['2.1'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '4',
                question_number: '4',
                question_text: 'Did the review authors use a comprehensive literature search strategy?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['4'].robis_responses || '',
                amstar_2_responses: answers_obj['4'].amstar_2_responses || '',
                agreement_or_not: answers_obj['4'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['4'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['4'].quote_from_sr || '',
                rationale: answers_obj['4'].rationale || '',
                has_quote_from_sr: answers_obj['4'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '24',
                question_number: '2.2',
                question_text: 'Were methods additional to database searching used to identify relevant reports?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['2.2'].robis_responses || '',
                amstar_2_responses: answers_obj['2.2'].amstar_2_responses || '',
                agreement_or_not: answers_obj['2.2'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['2.2'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['2.2'].quote_from_sr || '',
                rationale: answers_obj['2.2'].rationale || '',
                has_quote_from_sr: answers_obj['2.2'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '25',
                question_number: '2.3',
                question_text: 'Were the terms and structure of the search strategy likely to retrieve as many eligible studies as possible?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['2.3'].robis_responses || '',
                amstar_2_responses: answers_obj['2.3'].amstar_2_responses || '',
                agreement_or_not: answers_obj['2.3'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['2.3'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['2.3'].quote_from_sr || '',
                rationale: answers_obj['2.3'].rationale || '',
                has_quote_from_sr: answers_obj['2.3'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '26',
                question_number: '2.4',
                question_text: 'Were search strategy restrictions based on date, publication format, or language appropriate?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['2.4'].robis_responses || '',
                amstar_2_responses: answers_obj['2.4'].amstar_2_responses || '',
                agreement_or_not: answers_obj['2.4'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['2.4'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['2.4'].quote_from_sr || '',
                rationale: answers_obj['2.4'].rationale || '',
                has_quote_from_sr: answers_obj['2.4'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '27',
                question_number: '2.5',
                question_text: 'Were efforts made to minimise error in selection of studies?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['2.5'].robis_responses || '',
                amstar_2_responses: answers_obj['2.5'].amstar_2_responses || '',
                agreement_or_not: answers_obj['2.5'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['2.5'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['2.5'].quote_from_sr || '',
                rationale: answers_obj['2.5'].rationale || '',
                has_quote_from_sr: answers_obj['2.5'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '5',
                question_number: '5',
                question_text: 'Did the review authors perform study selection in duplicate?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['5'].robis_responses || '',
                amstar_2_responses: answers_obj['5'].amstar_2_responses || '',
                agreement_or_not: answers_obj['5'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['5'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['5'].quote_from_sr || '',
                rationale: answers_obj['5'].rationale || '',
                has_quote_from_sr: answers_obj['5'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '28',
                question_number: '2.6',
                question_text: 'Concerns regarding methods used to identify and/or select studies (low, high, unclear)',
                form_label: 'ROBIS',
                robis_responses: answers_obj['2.6'].robis_responses || '',
                amstar_2_responses: answers_obj['2.6'].amstar_2_responses || '',
                agreement_or_not: answers_obj['2.6'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['2.6'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['2.6'].quote_from_sr || '',
                rationale: answers_obj['2.6'].rationale || '',
                has_quote_from_sr: answers_obj['2.6'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '29',
                question_number: '3.1',
                question_text: 'Were efforts made to minimise error in data collection?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['3.1'].robis_responses || '',
                amstar_2_responses: answers_obj['3.1'].amstar_2_responses || '',
                agreement_or_not: answers_obj['3.1'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['3.1'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['3.1'].quote_from_sr || '',
                rationale: answers_obj['3.1'].rationale || '',
                has_quote_from_sr: answers_obj['3.1'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '6',
                question_number: '6',
                question_text: 'Did the review authors perform data extraction in duplicate?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['6'].robis_responses || '',
                amstar_2_responses: answers_obj['6'].amstar_2_responses || '',
                agreement_or_not: answers_obj['6'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['6'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['6'].quote_from_sr || '',
                rationale: answers_obj['6'].rationale || '',
                has_quote_from_sr: answers_obj['6'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '7',
                question_number: '7',
                question_text: 'Did the review authors provide a list of excluded studies and justify the exclusions?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['7'].robis_responses || '',
                amstar_2_responses: answers_obj['7'].amstar_2_responses || '',
                agreement_or_not: answers_obj['7'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['7'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['7'].quote_from_sr || '',
                rationale: answers_obj['7'].rationale || '',
                has_quote_from_sr: answers_obj['7'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '30',
                question_number: '3.2',
                question_text: 'Were sufficient study characteristics considered for both review authors and readers to be able to interpret the results?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['3.2'].robis_responses || '',
                amstar_2_responses: answers_obj['3.2'].amstar_2_responses || '',
                agreement_or_not: answers_obj['3.2'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['3.2'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['3.2'].quote_from_sr || '',
                rationale: answers_obj['3.2'].rationale || '',
                has_quote_from_sr: answers_obj['3.2'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '8',
                question_number: '8',
                question_text: 'Did the review authors describe the included studies in adequate detail?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['8'].robis_responses || '',
                amstar_2_responses: answers_obj['8'].amstar_2_responses || '',
                agreement_or_not: answers_obj['8'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['8'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['8'].quote_from_sr || '',
                rationale: answers_obj['8'].rationale || '',
                has_quote_from_sr: answers_obj['8'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '31',
                question_number: '3.3',
                question_text: 'Were all relevant study results collected for use in the synthesis?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['3.3'].robis_responses || '',
                amstar_2_responses: answers_obj['3.3'].amstar_2_responses || '',
                agreement_or_not: answers_obj['3.3'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['3.3'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['3.3'].quote_from_sr || '',
                rationale: answers_obj['3.3'].rationale || '',
                has_quote_from_sr: answers_obj['3.3'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '32',
                question_number: '3.4',
                question_text: 'Was risk of bias (or methodological quality) formally assessed using appropriate criteria?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['3.4'].robis_responses || '',
                amstar_2_responses: answers_obj['3.4'].amstar_2_responses || '',
                agreement_or_not: answers_obj['3.4'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['3.4'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['3.4'].quote_from_sr || '',
                rationale: answers_obj['3.4'].rationale || '',
                has_quote_from_sr: answers_obj['3.4'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '9',
                question_number: '9',
                question_text: 'Did the review authors use a satisfactory technique for assessing the risk of bias (RoB) in individual studies that were included in the review?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['9'].robis_responses || '',
                amstar_2_responses: answers_obj['9'].amstar_2_responses || '',
                agreement_or_not: answers_obj['9'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['9'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['9'].quote_from_sr || '',
                rationale: answers_obj['9'].rationale || '',
                has_quote_from_sr: answers_obj['9'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '33',
                question_number: '3.5',
                question_text: 'Were efforts made to minimise error in risk of bias assessment?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['3.5'].robis_responses || '',
                amstar_2_responses: answers_obj['3.5'].amstar_2_responses || '',
                agreement_or_not: answers_obj['3.5'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['3.5'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['3.5'].quote_from_sr || '',
                rationale: answers_obj['3.5'].rationale || '',
                has_quote_from_sr: answers_obj['3.5'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '34',
                question_number: '3.6',
                question_text: 'Concerns regarding methods used to collect data and appraise studies (low, high, unclear)',
                form_label: 'ROBIS',
                robis_responses: answers_obj['3.6'].robis_responses || '',
                amstar_2_responses: answers_obj['3.6'].amstar_2_responses || '',
                agreement_or_not: answers_obj['3.6'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['3.6'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['3.6'].quote_from_sr || '',
                rationale: answers_obj['3.6'].rationale || '',
                has_quote_from_sr: answers_obj['3.6'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '35',
                question_number: '4.1',
                question_text: 'Did the synthesis include all studies that it should?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['4.1'].robis_responses || '',
                amstar_2_responses: answers_obj['4.1'].amstar_2_responses || '',
                agreement_or_not: answers_obj['4.1'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['4.1'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['4.1'].quote_from_sr || '',
                rationale: answers_obj['4.1'].rationale || '',
                has_quote_from_sr: answers_obj['4.1'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '36',
                question_number: '4.2',
                question_text: 'Were all pre-defined analyses reported or departures explained?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['4.2'].robis_responses || '',
                amstar_2_responses: answers_obj['4.2'].amstar_2_responses || '',
                agreement_or_not: answers_obj['4.2'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['4.2'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['4.2'].quote_from_sr || '',
                rationale: answers_obj['4.2'].rationale || '',
                has_quote_from_sr: answers_obj['4.2'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '37',
                question_number: '4.3',
                question_text: 'Was the synthesis appropriate given the nature and similarity in the research questions, study designs and outcomes across included studies?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['4.3'].robis_responses || '',
                amstar_2_responses: answers_obj['4.3'].amstar_2_responses || '',
                agreement_or_not: answers_obj['4.3'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['4.3'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['4.3'].quote_from_sr || '',
                rationale: answers_obj['4.3'].rationale || '',
                has_quote_from_sr: answers_obj['4.3'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '11',
                question_number: '11',
                question_text: 'If meta-analysis was performed did the review authors use appropriate methods for statistical combination of results?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['11'].robis_responses || '',
                amstar_2_responses: answers_obj['11'].amstar_2_responses || '',
                agreement_or_not: answers_obj['11'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['11'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['11'].quote_from_sr || '',
                rationale: answers_obj['11'].rationale || '',
                has_quote_from_sr: answers_obj['11'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '38',
                question_number: '4.4',
                question_text: 'Was between-study variation (heterogeneity) minimal or addressed in the synthesis?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['4.4'].robis_responses || '',
                amstar_2_responses: answers_obj['4.4'].amstar_2_responses || '',
                agreement_or_not: answers_obj['4.4'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['4.4'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['4.4'].quote_from_sr || '',
                rationale: answers_obj['4.4'].rationale || '',
                has_quote_from_sr: answers_obj['4.4'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '14',
                question_number: '14',
                question_text: 'Did the review authors provide a satisfactory explanation for, and discussion of, any heterogeneity observed in the results of the review?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['14'].robis_responses || '',
                amstar_2_responses: answers_obj['14'].amstar_2_responses || '',
                agreement_or_not: answers_obj['14'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['14'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['14'].quote_from_sr || '',
                rationale: answers_obj['14'].rationale || '',
                has_quote_from_sr: answers_obj['14'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '39',
                question_number: '4.5',
                question_text: 'Were the findings robust, e.g. as demonstrated through funnel plot or sensitivity analyses?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['4.5'].robis_responses || '',
                amstar_2_responses: answers_obj['4.5'].amstar_2_responses || '',
                agreement_or_not: answers_obj['4.5'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['4.5'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['4.5'].quote_from_sr || '',
                rationale: answers_obj['4.5'].rationale || '',
                has_quote_from_sr: answers_obj['4.5'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '15',
                question_number: '15',
                question_text: 'If they performed quantitative synthesis did the review authors carry out an adequate investigation of publication bias (small study bias) and discuss its likely impact on the results of the review?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['15'].robis_responses || '',
                amstar_2_responses: answers_obj['15'].amstar_2_responses || '',
                agreement_or_not: answers_obj['15'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['15'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['15'].quote_from_sr || '',
                rationale: answers_obj['15'].rationale || '',
                has_quote_from_sr: answers_obj['15'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '40',
                question_number: '4.6',
                question_text: 'Were biases in primary studies minimal or addressed in the synthesis?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['4.6'].robis_responses || '',
                amstar_2_responses: answers_obj['4.6'].amstar_2_responses || '',
                agreement_or_not: answers_obj['4.6'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['4.6'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['4.6'].quote_from_sr || '',
                rationale: answers_obj['4.6'].rationale || '',
                has_quote_from_sr: answers_obj['4.6'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '12',
                question_number: '12',
                question_text: 'If meta-analysis was performed, did the review authors assess the potential impact of RoB in individual studies on the results of the meta-analysis?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['12'].robis_responses || '',
                amstar_2_responses: answers_obj['12'].amstar_2_responses || '',
                agreement_or_not: answers_obj['12'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['12'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['12'].quote_from_sr || '',
                rationale: answers_obj['12'].rationale || '',
                has_quote_from_sr: answers_obj['12'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '10',
                question_number: '10',
                question_text: 'Did the review authors report on the sources of funding for the studies included in the review?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['10'].robis_responses || '',
                amstar_2_responses: answers_obj['10'].amstar_2_responses || '',
                agreement_or_not: answers_obj['10'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['10'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['10'].quote_from_sr || '',
                rationale: answers_obj['10'].rationale || '',
                has_quote_from_sr: answers_obj['10'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '16',
                question_number: '16',
                question_text: 'Did the review authors report any potential sources of conflict of interest, including any funding they received for conducting the review?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['16'].robis_responses || '',
                amstar_2_responses: answers_obj['16'].amstar_2_responses || '',
                agreement_or_not: answers_obj['16'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['16'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['16'].quote_from_sr || '',
                rationale: answers_obj['16'].rationale || '',
                has_quote_from_sr: answers_obj['16'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '41',
                question_number: 'A',
                question_text: 'Did the interpretation of findings address all of the concerns identified in Domains 1 to 4?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['A'].robis_responses || '',
                amstar_2_responses: answers_obj['A'].amstar_2_responses || '',
                agreement_or_not: answers_obj['A'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['A'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['A'].quote_from_sr || '',
                rationale: answers_obj['A'].rationale || '',
                has_quote_from_sr: answers_obj['A'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '13',
                question_number: '13',
                question_text: 'Did the review authors account for RoB in individual studies when interpreting/ discussing the results of the review?',
                form_label: 'AMSTAR',
                robis_responses: answers_obj['13'].robis_responses || '',
                amstar_2_responses: answers_obj['13'].amstar_2_responses || '',
                agreement_or_not: answers_obj['13'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['13'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['13'].quote_from_sr || '',
                rationale: answers_obj['13'].rationale || '',
                has_quote_from_sr: answers_obj['13'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '42',
                question_number: 'B',
                question_text: 'Was the relevance of identified studies to the review\'s research question appropriately considered?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['B'].robis_responses || '',
                amstar_2_responses: answers_obj['B'].amstar_2_responses || '',
                agreement_or_not: answers_obj['B'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['B'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['B'].quote_from_sr || '',
                rationale: answers_obj['B'].rationale || '',
                has_quote_from_sr: answers_obj['B'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '43',
                question_number: 'C',
                question_text: 'Did the reviewers avoid emphasizing results on the basis of their statistical significance?',
                form_label: 'ROBIS',
                robis_responses: answers_obj['C'].robis_responses || '',
                amstar_2_responses: answers_obj['C'].amstar_2_responses || '',
                agreement_or_not: answers_obj['C'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['C'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['C'].quote_from_sr || '',
                rationale: answers_obj['C'].rationale || '',
                has_quote_from_sr: answers_obj['C'].has_quote_from_sr || false,
                pdf_id: pdfId
            },
            {
                question_id: '44',
                question_number: 'Overall Judgment',
                question_text: 'ROBIS Overall Judgment: (low, high, unclear)',
                form_label: 'ROBIS',
                robis_responses: answers_obj['Overall Judgment'].robis_responses || '',
                amstar_2_responses: answers_obj['Overall Judgment'].amstar_2_responses || '',
                agreement_or_not: answers_obj['Overall Judgment'].agreement_or_not || '',
                clarity_of_evidence: answers_obj['Overall Judgment'].clarity_of_evidence || '',
                quote_from_sr: answers_obj['Overall Judgment'].quote_from_sr || '',
                rationale: answers_obj['Overall Judgment'].rationale || '',
                has_quote_from_sr: answers_obj['Overall Judgment'].has_quote_from_sr || false,
                pdf_id: pdfId
            }


        ])

    }, [currentAnswers])

    return (
        <div>
            <div style={{ height: '86vh', backgroundColor: 'white', overflow: 'auto' }}>
                {questions.map((question, index) => (
                    <div style={{ paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px', backgroundColor: index % 2 === 0 ? 'lightblue' : 'lightgreen' }}
                        key={index}
                    >
                        <h5 style={{ marginLeft: '10px', color: 'black' }}>
                            <br />
                            <b style={{ color: question.form_label === 'ROBIS' ? 'red' : '#7700ff' }}><u>{question.form_label}</u></b>&nbsp;
                            {question.question_number}{`)`} {question.question_text}
                        </h5>



                        <table className="table table-bordered">
                            <tbody>
                                {question.form_label === 'ROBIS' &&
                                    <tr>
                                        <th scope="row">ROBIS responses</th>
                                        <td>
                                            <select
                                                value={question.robis_responses || 'Select Response'}
                                                onChange={(event) => answerOrUpdateQuestion(event, index, 'robis_responses')}
                                                disabled={currentPdfData.status === 'Available' || currentPdfData.status === 'Completed'}

                                            >
                                                <option value=''>Select Response</option>
                                                <option value="Yes">Yes</option>
                                                <option value="Probably Yes">Probably Yes</option>
                                                <option value="No">No</option>
                                                <option value="Probably No">Probably No</option>
                                                <option value="No Information">No Information</option>
                                            </select>
                                        </td>
                                    </tr>}
                                {question.form_label === 'AMSTAR' &&
                                    <tr>
                                        <th scope="row">AMSTAR 2 responses</th>
                                        <td>
                                            <select
                                                value={question.amstar_2_responses || 'Select Response'}
                                                onChange={(event) => answerOrUpdateQuestion(event, index, 'amstar_2_responses')}
                                                disabled={currentPdfData.status === 'Available' || currentPdfData.status === 'Completed'}

                                            >
                                                <option value="">Select Response</option>
                                                <option value="Yes">Yes</option>
                                                <option value="Partial Yes">Partial Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </td>
                                    </tr>
                                }
                                <tr>
                                    <th scope="row">Agreement or not</th>
                                    <td>
                                        <select
                                            style={{ width: '150px' }}
                                            value={question.agreement_or_not || 'Select Response'}
                                            onChange={(event) => answerOrUpdateQuestion(event, index, 'agreement_or_not')}
                                            disabled={currentPdfData.status === 'Available' || currentPdfData.status === 'Completed'}
                                        >
                                            <option value="">Select Response</option>
                                            <option value="Agreement between reviewers">Agreement between reviewers</option>
                                            <option value="Disagreement between reviewers">Disagreement between reviewers</option>
                                            <option value="Not applicable as there was only one reviewer">Not applicable as there was only one reviewer</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Clarity of evidence</th>
                                    <td>
                                        <select
                                            style={{ width: '150px' }}
                                            value={question.clarity_of_evidence || 'Select Response'}
                                            onChange={(event) => answerOrUpdateQuestion(event, index, 'clarity_of_evidence')}
                                            disabled={currentPdfData.status === 'Available' || currentPdfData.status === 'Completed'}
                                        >
                                            <option value="">Select Response</option>
                                            <option value="Rank 1 Clear: Has a clear quote that makes the judgment easy to make">Rank 1 Clear: Has a clear quote that makes the judgment easy to make</option>
                                            <option value="Rank 2a Weak: Has a quote but it is vague or hard to understand">Rank 2a Weak: Has a quote but it is vague or hard to understand</option>
                                            <option value="Rank 2b Weak: Has a quote but the information is not complete. Missing components or more information needed">Rank 2b Weak: Has a quote but the information is not complete. Missing components or more information needed</option>
                                            <option value="Rank 2c: Information or data is in a figure or table and cannot be quoted">Rank 2c: Information or data is in a figure or table and cannot be quoted</option>
                                            <option value="Rank 3 Difference: Has contradictory text - one quote says one thing and another quote contradicts">Rank 3 Difference: Has contradictory text - one quote says one thing and another quote contradicts</option>
                                            <option value="Rank 3: No information in the full text or supplements">Rank 3: No information in the full text or supplements</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        No Quote Found
                                    </th>
                                    <td>
                                        <input
                                            style={{ transform: 'scale(2)', marginLeft: '10px', marginTop: '16px' }}
                                            type="checkbox"
                                            checked={question.has_quote_from_sr}
                                            onChange={(event) => {
                                                const isChecked = event.target.checked
                                                if (isChecked === true) {
                                                    setQuoteFromSrAnswers(prevState => ({
                                                        ...prevState,
                                                        [index]: ''
                                                    }));
                                                    answerOrUpdateQuestion('', index, 'quote_from_sr');
                                                    answerOrUpdateQuestion(true, index, 'has_quote_from_sr');
                                                } else {
                                                    setQuoteFromSrAnswers(prevState => ({
                                                        ...prevState,
                                                        [index]: prevState[index]
                                                    }));
                                                    answerOrUpdateQuestion(false, index, 'has_quote_from_sr');
                                                }
                                            }
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        Quote from SR
                                    </th>
                                    <td>
                                        <textarea
                                            style={{ height: '100px', width: '350px' }}
                                            value={question.quote_from_sr || ''}
                                            placeholder={'Enter quote'}
                                            readOnly={currentPdfData.status === 'Available' || currentPdfData.status === 'Completed' || question.has_quote_from_sr === true}
                                            onFocus={() => { if (question.has_quote_from_sr !== true) { handleFocusClick(index, currentPdfData.status) } }}
                                            onChange={(event) => {
                                                if (question.has_quote_from_sr !== true) {
                                                    setQuoteFromSrAnswers(prevState => ({
                                                        ...prevState,
                                                        [index]: event.target.value
                                                    }));
                                                    answerOrUpdateQuestion(event, index, 'quote_from_sr');
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Rationale</th>
                                    <td>
                                        <textarea
                                            style={{ height: '60px', width: '350px' }}
                                            value={question.rationale || ''}
                                            readOnly={currentPdfData.status === 'Available' || currentPdfData.status === 'Completed'}
                                            onChange={(event) => answerOrUpdateQuestion(event, index, 'rationale')}
                                        />
                                    </td>
                                </tr>
                                {index !== 0 &&
                                    <tr>
                                        <th colSpan="2">
                                            <button onClick={() => {
                                                {if (questions[index].form_label === 'ROBIS' && questions[index -1].form_label === 'ROBIS') {answerOrUpdateQuestion(questions[index - 1].robis_responses, index, 'robis_responses')}}
                                                {if (questions[index].form_label === 'AMSTAR' && questions[index -1].form_label === 'AMSTAR') {answerOrUpdateQuestion(questions[index - 1].amstar_2_responses, index, 'amstar_2_responses')}}
                                                answerOrUpdateQuestion(questions[index - 1].agreement_or_not, index, 'agreement_or_not')
                                                answerOrUpdateQuestion(questions[index - 1].clarity_of_evidence, index, 'clarity_of_evidence')
                                                answerOrUpdateQuestion(questions[index - 1].quote_from_sr, index, 'quote_from_sr')
                                                answerOrUpdateQuestion(questions[index - 1].rationale, index, 'rationale')
                                                answerOrUpdateQuestion(questions[index - 1].has_quote_from_sr, index, 'has_quote_from_sr')
                                            }}
                                                className='btn btn-primary'
                                                style={{ width: '100%' }}
                                                disabled={currentPdfData.status === 'Available' || currentPdfData.status === 'Completed'}
                                            >
                                                Same Answers as the Question Above</button>
                                        </th>
                                    </tr>}
                            </tbody>
                        </table>
                    </div>
                ))}

            </div>
            {(currentPdfData.status === "Revision Needed" || currentPdfData.status === "Being Worked On") &&
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginLeft: '20px', marginRight: '20px' }}>
                    <button className='btn btn-dark' onClick={() => { handleSaveQuestions('Being Worked On'); setSaveQuestionsConfirmPopup(true); }} style={{ width: '48%' }}>Save Progress</button>
                    <button className='btn btn-dark' onClick={() => openChatPopup()} style={{ width: '48%' }}>Submit for Validation</button>
                </div>
            }

            {(currentPdfData.status === "Completed") &&
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginLeft: '20px', marginRight: '20px' }}>
                    <button className='btn btn-dark' onClick={() => openChatPopup()} style={{ width: '100%' }}>Request to Re-Annotate</button>
                </div>
            }

            {(currentPdfData.status === "Being Validated") &&
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginLeft: '20px', marginRight: '20px' }}>
                    <button className='btn btn-dark' onClick={() => { handleSaveQuestions('Completed'); handleValidatorStatus(); openPaperApprovedPopup(); }} style={{ width: '48%' }}>Approve Paper</button>
                    <button className='btn btn-dark' onClick={() => openRequestForRevisionPopup()} style={{ width: '48%' }}>Request for Revision</button>
                </div>
            }

            {(currentPdfData.status === "Re-Annotation Requested") &&
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginLeft: '20px', marginRight: '20px' }}>
                    <button className='btn btn-dark' onClick={() => { handleSaveQuestions('Completed'); handleRejectRevision('Completed'); handleValidatorStatus(); openPaperRejectedPopup(); }} style={{ width: '48%' }}>Reject Request</button>
                    <button className='btn btn-dark' onClick={() => { openRevisionPermissionPopup() }} style={{ width: '48%' }}>Allow for Revision</button>
                </div>
            }



            {chatPopupVisibility && (
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
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '40rem' }}>
                        <div className="card-body">
                            {(currentPdfData.status === "Revision Needed" || currentPdfData.status === "Being Worked On") &&
                                <h4 style={{ textAlign: 'center' }} className="card-title">Submit For Validation</h4>}

                            {(currentPdfData.status === "Completed") &&
                                <h4 style={{ textAlign: 'center' }} className="card-title">Request to Re-Annotate This Paper</h4>}
                            <h5 className="card-title">Paper ID: {currentPdfData.pdf_id}</h5>
                            <h5 style={{ marginBottom: '14px' }} className="card-title">Paper Title: {currentPdfData.pdf_title}</h5>
                            {currentPdfData.chat_history ? <hr /> : ''}
                            {/* {Object.entries(currentChatHistoryReformattedForDisplay).map(([key, value], index) => (
                                <p key={index}>{key}: {value}</p>
                            ))} */}
                            {/* {//console.log(`temp questions here here here test: ${currentPdfData.p}`)} */}
                            {currentPdfData.status !== 'Completed' && currentPdfData.chat_history && currentPdfData.chat_history.length > 0 && currentPdfData.chat_history.split("——new line——").map((chat, index) => {
                                return (
                                    <p key={index}>{chat}</p>
                                )
                            })
                            }
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <textarea onChange={(event) => setChatboxValue(event.target.value)} placeholder='Enter any comments here (Optional)' style={{ marginBottom: '20px' }} />
                                <div>
                                    {(currentPdfData.status === "Revision Needed" || currentPdfData.status === "Being Worked On") &&
                                        <a href="#" className="btn btn-primary" onClick={() => handleSubmitQuestions()}>Submit Paper</a>}


                                    {(currentPdfData.status === "Completed") &&
                                        <a href="#" className="btn btn-primary" onClick={() => handleRequestForReAnnotation('Re-Annotation Requested')}>Request to Re-Annotate This Paper</a>}


                                    <button className="btn btn-secondary" onClick={() => closeChatPopup()} style={{ marginLeft: '10px' }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {revisionPermissionPopup && (
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
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '40rem' }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ textAlign: 'center' }}>Chat History and Paper Details</h5><hr />
                            <h5 className="card-title">Paper ID: {currentPdfData.pdf_id}</h5>
                            <h5 style={{ marginBottom: '14px' }} className="card-title">Paper Title: {currentPdfData.pdf_title}</h5>
                            {currentPdfData.chat_history ? <hr /> : ''}

                            {currentPdfData.status !== 'Completed' && currentPdfData.chat_history && currentPdfData.chat_history.length > 0 && currentPdfData.chat_history.split("——new line——").map((chat, index) => {
                                return (
                                    <p key={index}>{chat}</p>
                                )
                            })
                            }
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <textarea onChange={(event) => setChatboxValue(event.target.value)} placeholder='Enter any comments here (Optional)' style={{ marginBottom: '20px' }} />
                                <div>

                                    {(currentPdfData.status === "Re-Annotation Requested") &&
                                        <a href="#" className="btn btn-primary" onClick={() => { handleSaveQuestions('Revision Needed'); handlePermissionToReEditPaper('Revision Needed'); handleValidatorStatus(); navigate('/choose-pdf') }}>Allow for Revision</a>}



                                    <button className="btn btn-secondary" onClick={() => closeRevisionPermissionPopup()} style={{ marginLeft: '10px' }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {saveQuestionsConfirmPopup && (
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
                    <div className="card" style={{ width: '30rem' }}>
                        <div className="card-body" style={{ overflowY: 'auto' }} onScroll={e => e.stopPropagation()}>
                            <div>
                                <h3 style={{ textAlign: 'center', color: 'green' }} className="card-title">Progress Saved Successfully</h3>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button className="btn btn-success" onClick={() => setSaveQuestionsConfirmPopup(false)}>Okay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {paperApprovedPopup && (
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
                    <div className="card" style={{ width: '30rem' }}>
                        <div className="card-body" style={{ overflowY: 'auto' }} onScroll={e => e.stopPropagation()}>
                            <div>
                                <h3 style={{ textAlign: 'center', color: 'green' }} className="card-title">Paper Approved Successfully!</h3>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button className="btn btn-success" onClick={() => navigate('/choose-pdf')}>Okay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {paperRejectedPopup && (
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
                    <div className="card" style={{ width: '30rem' }}>
                        <div className="card-body" style={{ overflowY: 'auto' }} onScroll={e => e.stopPropagation()}>
                            <div>
                                <h3 style={{ textAlign: 'center', color: 'green' }} className="card-title">The request for re-annotation was rejected. Paper status changed to "Completed" Again</h3>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button className="btn btn-success" onClick={() => navigate('/choose-pdf')}>Okay</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {requestForRevisionPopup && (
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
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '40rem' }}>
                        <div className="card-body">
                            {(currentPdfData.status === "Being Validated") &&
                                <h4 style={{ textAlign: 'center' }} className="card-title">Request for Revision</h4>}


                            <h5 className="card-title">Paper ID: {currentPdfData.pdf_id}</h5>
                            <h5 style={{ marginBottom: '14px' }} className="card-title">Paper Title: {currentPdfData.pdf_title}</h5>
                            {currentPdfData.chat_history ? <hr /> : ''}

                            {currentPdfData.status !== 'Completed' && currentPdfData.chat_history && currentPdfData.chat_history.length > 0 && currentPdfData.chat_history.split("——new line——").map((chat, index) => {
                                return (
                                    <p key={index}>{chat}</p>
                                )
                            })
                            }
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <textarea onChange={(event) => setChatboxValue(event.target.value)} placeholder='Enter any comments here (Optional)' style={{ marginBottom: '20px' }} />
                                <div>
                                    {(currentPdfData.status === "Being Validated") &&
                                        <a href="#" className="btn btn-primary" onClick={() => { handleSaveQuestions('Revision Needed'); handleRequestToRevise('Revision Needed'); handleValidatorStatus(); navigate('/choose-pdf') }}>Request for Revision</a>}


                                    <button className="btn btn-secondary" onClick={() => closeRequestForRevisionPopup()} style={{ marginLeft: '10px' }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Questions;