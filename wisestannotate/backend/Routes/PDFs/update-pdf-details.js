const handleUpdatePdfDetails = async (req, res, db) => {
    try {
        const { updateType } = req.body;

        if (updateType === 'pdf_title_update') {
            const { pdf_data } = req.body;
            for (const pdf of pdf_data) {
                const { pdf_id, pdf_title } = pdf;
                await db('pdf_files')
                    .where({ pdf_id })
                    .update({ pdf_title });
            }
        } else if (updateType === 'status_and_annoted_by_update') {
            const { pdf_id, status, annotated_by } = req.body;

            // Retrieve the current annotated_by array
            const currentPdf = await db('pdf_files')
                .where({ pdf_id })
                .select('annotated_by')
                .first();

            // Ensure currentPdf and annotated_by are valid
            if (!currentPdf) {
                throw new Error('PDF not found');
            }

            // Parse the current annotated_by field as JSON
            let updatedAnnotatedBy = JSON.parse(currentPdf.annotated_by || '[]');

            // Append the new annotated_by string to the array
            updatedAnnotatedBy.push(annotated_by);

            // Update the PDF details in the database with JSON string
            await db('pdf_files')
                .where({ pdf_id })
                .update({ status, annotated_by: JSON.stringify(updatedAnnotatedBy) });
        } else {
            throw new Error('Invalid update type');
        }

        // Send a success response
        res.json({ message: 'PDF details updated successfully' });
    } catch (error) {
        console.error('Error updating PDF details:', error);
        // Send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default { handleUpdatePdfDetails };
