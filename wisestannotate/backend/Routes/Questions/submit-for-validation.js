const handleSubmitForValidation = async (req, res, db) => {
    try {
      const { questions, chat_history } = req.body;
  
  
      // Check if the request body contains the necessary data
      if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid data format' });
      }
  
      // Loop through the questions data and insert or update each question and its responses into the database
      await Promise.all(questions.map(async (question) => {
        const {
          question_id,
          pdf_id,
          question_number,
          robis_responses,
          amstar_2_responses,
          agreement_or_not,
          clarity_of_evidence,
          quote_from_sr,
          rationale,
          has_quote_from_sr
        } = {
            ...question,
            has_quote_from_sr: question.has_quote_from_sr ? 1 : 0
        };
  
        if (chat_history === '') {
          await db('pdf_files').where({ pdf_id }).update({ status: 'Being Validated'});
        } else {
          await db('pdf_files').where({ pdf_id }).update({ status: 'Being Validated', chat_history: chat_history });
        }
        
  
        // Check if there is an existing record with the same pdf_id and question_id
        const existingRecord = await db('analysis_answers')
          .where({ pdf_id, question_id })
          .first();
  
        if (existingRecord) {
          // If a record exists, update it
          await db('analysis_answers')
            .where({ pdf_id, question_id })
            .update({
              robis_responses,
              amstar_2_responses,
              agreement_or_not,
              clarity_of_evidence,
              quote_from_sr,
              rationale,
              has_quote_from_sr
            });
        } else {
          // If no record exists, insert a new one
          await db('analysis_answers').insert({
            question_id,
            pdf_id,
            question_number,
            robis_responses,
            amstar_2_responses,
            agreement_or_not,
            clarity_of_evidence,
            quote_from_sr,
            rationale,
            has_quote_from_sr
          });
        }
  
  
      }));
  
      res.status(200).json({ message: 'Submission for Validation was successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  export default { handleSubmitForValidation }