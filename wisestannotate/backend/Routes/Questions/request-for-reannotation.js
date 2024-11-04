const handleRequestForReAnnotation = async (req, res, db) => {
    const { pdf_id, status, chat_history, annotated_by } = req.body;
    try {
        // Retrieve the current annotated_by array
        const currentPdf = await db('pdf_files')
            .where({ pdf_id })
            .select('annotated_by')
            .first();

        // Append the new value to the annotated_by array
        const updatedAnnotatedBy = [
            ...(currentPdf.annotated_by || []),
            `${annotated_by} Pending Request`
        ];

        // Convert updatedAnnotatedBy to a JSON string
        const annotatedByJSON = JSON.stringify(updatedAnnotatedBy);

        // Update the PDF details in the database
        await db('pdf_files')
            .where({ pdf_id })
            .update({ status, chat_history, annotated_by: annotatedByJSON });

        // Send a success response
        res.status(200).json({ message: 'Submission for re-annotation was successful' });
    } catch (error) {
        console.error('Error updating PDF details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { handleRequestForReAnnotation };

