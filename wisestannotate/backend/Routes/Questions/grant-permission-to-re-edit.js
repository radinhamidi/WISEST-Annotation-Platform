const handlePermissionToReEditPaper = async (req, res, db) => {
    const { pdf_id, status, chat_history, validated_by } = req.body;
    try {
        // Retrieve the current annotated_by array
        const currentAnnotatedBy = await db('pdf_files')
            .where({ pdf_id })
            .select('annotated_by')
            .first();

        console.log(`current Annotated By: ${JSON.stringify(currentAnnotatedBy)}`);

        // Extract the annotated_by array from the result
        const annotatedByArray = currentAnnotatedBy.annotated_by || [];

        let updatedAnnotatedBy = [...annotatedByArray]; // Create a copy of annotatedByArray
        console.log('hi');
        console.log(`updatedAnnotatedBy: ${JSON.stringify(updatedAnnotatedBy)}`);

        if (updatedAnnotatedBy.length > 0) {
            // Get the last index
            let lastIndex = updatedAnnotatedBy.length - 1;
            // Replace ' Pending Request' with ''
            updatedAnnotatedBy[lastIndex] = updatedAnnotatedBy[lastIndex].replace(' Pending Request', '');
        }

        // Convert updatedAnnotatedBy to a JSON string
        const annotatedByJSON = JSON.stringify(updatedAnnotatedBy);

        // Retrieve the current validated_by array
        const currentValidatedBy = await db('pdf_files')
            .where({ pdf_id })
            .select('validated_by')
            .first();

        console.log(`current Validated By: ${JSON.stringify(currentValidatedBy)}`);

        // Extract the validated_by array from the result
        const validatedByArray = currentValidatedBy.validated_by || [];

        // Initialize the new validated_by array
        let updatedValidatedBy = validatedByArray;

        // Check if the person is already in the array
        if (!updatedValidatedBy.includes(validated_by)) {
            // Append the new value to the validated_by array
            updatedValidatedBy.push(validated_by);
        }

        // Convert updatedValidatedBy to a JSON string
        const validatedByJson = JSON.stringify(updatedValidatedBy);

        await db('pdf_files').where({ pdf_id }).update({ status, chat_history, annotated_by: annotatedByJSON, validated_by: validatedByJson });

        res.status(200).json({ message: 'Permission to edit was granted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { handlePermissionToReEditPaper };
