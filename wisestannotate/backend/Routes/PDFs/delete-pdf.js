import fs from 'fs';

const handleDeletePdf = async (req, res, db) => {
    const trx = await db.transaction();

    try {
        const { pdf_id } = req.params;

        // Retrieve the PDF file details from the database
        const pdf = await trx('pdf_files').where({ pdf_id }).first();

        if (!pdf) {
            await trx.rollback();
            return res.status(404).json({ error: 'PDF not found' });
        }

        // Delete related entries in the analysis_answers table
        await trx('analysis_answers').where({ pdf_id }).del();

        // Delete the PDF file from the file system 
        const filePath = `uploads/${pdf.pdf_file_name}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete related entries in the pdf_DOIs table
        await trx('pdf_DOIs').where({ pdf_id }).del();

        // Delete the PDF details from the database
        await trx('pdf_files').where({ pdf_id }).del();

        await trx.commit();
        res.status(200).json({ message: 'PDF deleted successfully' });
    } catch (error) {
        await trx.rollback();
        console.error('Error deleting PDF:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { handleDeletePdf };
