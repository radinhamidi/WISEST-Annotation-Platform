const handleGetAllPdfDetails = async (req, res, db) => {
    try {
        const pdfData = await db('pdf_files').select('pdf_id', 'pdf_number', 'pdf_file_name', 'pdf_title', 'status', 'annotated_by', 'validated_by', 'chat_history', 'uploaded_by')

        if (!pdfData) {
            return res.status(404).send('PDF files not found');
        }

        res.status(200).json(pdfData)
    } catch (error) {
        console.error('Error retrieving PDF details:', error);
        res.status(500).send('Internal server error.');
    }
}

export default { handleGetAllPdfDetails }