const handleUpdateValidatorStatus = async (req, res, db) => {
    try {
        const { pdf_id, validated_by } = req.body;

        // Retrieve the current validated_by array
        const currentValidatedBy = await db('pdf_files')
            .where({ pdf_id })
            .select('validated_by')
            .first();

        console.log(`current Validated By: ${JSON.stringify(currentValidatedBy)}`);

        // Extract the validated_by array from the result
        let validatedByArray = currentValidatedBy.validated_by || [];

        // Initialize the new validated_by array
        let updatedValidatedBy = validatedByArray;

        // Check if the person is already in the array
        const index = updatedValidatedBy.indexOf(validated_by);
        if (index !== -1) {
            // If the person exists, remove them from the array
            updatedValidatedBy.splice(index, 1);
        }

        // Append the new value to the end of the validated_by array
        updatedValidatedBy.push(validated_by);

        // Convert updatedValidatedBy to a JSON string
        const validatedByJson = JSON.stringify(updatedValidatedBy);

        await db('pdf_files').where({ pdf_id }).update({ validated_by: validatedByJson });

        // Send a success response
        res.status(200).json({ message: 'Validator status was updated successfully' });
    } catch (error) {
        console.error('Error updating PDF details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { handleUpdateValidatorStatus };
