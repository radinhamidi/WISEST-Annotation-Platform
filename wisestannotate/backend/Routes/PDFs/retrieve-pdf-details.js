const handleRetrievePdfDetails = async (req, res, db) => {
    try {
        const pdf_id = req.params.pdf_id;
        const pdf_details = await db('pdf_files')
            .where({ pdf_id })
            .select('pdf_id', 'pdf_number', 'pdf_file_name', 'pdf_title', 'status', 'annotated_by', 'validated_by', 'chat_history')

        if (!pdf_details) {
            return res.status(404).send('PDF not found')
        }

        res.status(200).json(pdf_details)
    } catch (error) {
        console.error(`Error retrieving the PDF: ${error}`)
        res.status(500).send('Internal server erorr.')
    }
}

export default { handleRetrievePdfDetails }