const handleRetrieveSpecificPdfAnswers = async (req, res, db) => {
    try {
        const pdf_id = req.params.pdf_id;

        // Retrieve the answers from the database based on pdf_id
        const answers = await db('analysis_answers')
            .select('*')
            .where('pdf_id', pdf_id);

        if (!answers || answers.length === 0) {
            return res.status(404).send('Answers not found');
        }

        // Modify has_quote_from_sr property
        const modifiedAnswers = answers.map(answer => ({
            ...answer,
            has_quote_from_sr: answer.has_quote_from_sr === 1
        }));
        console.log(modifiedAnswers)
        return res.status(200).json(modifiedAnswers);
    } catch (error) {
        console.error('Error retrieving answers:', error);
        res.status(500).send('Internal server error.');
    }
};

export default { handleRetrieveSpecificPdfAnswers };
