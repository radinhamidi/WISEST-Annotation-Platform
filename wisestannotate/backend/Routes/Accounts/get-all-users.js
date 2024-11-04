const handleGetAllUsers = async (req, res, db) => {
    try {
        const users = await db('accounts').select('id', 'email', 'role', 'created_at', 'updated_at', 'name')

        if (!users) {
            return res.status(404).send('Users not found');
        }

        //send
        res.status(200).json(users)
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send('Internal server error.');
    }
}

export default { handleGetAllUsers }