const handleRetrievePdfFile = async (req, res, db) => {
    try {
        const pdf_id = req.params.pdf_id;

        // Retrieve the PDF file from the database based on id
        const pdfData = await db('pdf_files')
            .select('pdf_file')
            .where('pdf_id', pdf_id)
            .first();

        if (!pdfData) {
            return res.status(404).send('PDF not found');
        }

        // Send the PDF file in the response
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfData.pdf_file);
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        res.status(500).send('Internal server error.');
    }
}

export default { handleRetrievePdfFile }