const handleRequestToRevise = async (req, res, db) => {
    const { pdf_id, status, chat_history } = req.body;
    try {
        await db('pdf_files').where({ pdf_id }).update({ status, chat_history });

        res.status(200).json({ message: 'Request for revision was granted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { handleRequestToRevise };