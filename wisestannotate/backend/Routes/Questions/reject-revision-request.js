const handleRejectRevisionRequest = async (req, res, db) => {
    try {
        const { pdf_id, status, validated_by } = req.body;
        // Retrieve current annotated_by array
        const currentPdf = await db('pdf_files')
            .where({ pdf_id })
            .select('annotated_by')
            .first();

        if (!currentPdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        console.log(`first log: ${currentPdf}`)
        let annotatedByArray = currentPdf.annotated_by || [];
        console.log(`second log: ${annotatedByArray}`)
        // Remove the last element from annotatedByArray
        if (annotatedByArray.length > 0) {
            annotatedByArray.pop();
        }
        console.log(`third log: ${annotatedByArray}`)
        // Convert updated annotated_by array to JSON string
        const annotatedByJSON = JSON.stringify(annotatedByArray);
        console.log(`fourth log: ${annotatedByJSON}`)
        
        // Retrieve the current validated_by array
        const validatedByList = await db('pdf_files')
            .where({ pdf_id })
            .select('validated_by')
            .first();

        // Initialize the new validated_by array
        let updatedValidatedBy = validatedByList.validated_by || [];

        // Check if the person is already in the array
        if (!updatedValidatedBy.includes(validated_by)) {
            // Append the new value to the validated_by array
            updatedValidatedBy.push(validated_by);
        }

        // Convert updatedValidatedBy to a JSON string
        const validatedByJson = JSON.stringify(updatedValidatedBy);

        // Update the PDF details in the database
        await db('pdf_files')
            .where({ pdf_id })
            .update({ status, annotated_by: annotatedByJSON, validated_by: validatedByJson });

        // Send a success response
        res.status(200).json({ message: 'Submission for re-annotation was successful' });
    } catch (error) {
        console.error('Error updating PDF details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { handleRejectRevisionRequest };
