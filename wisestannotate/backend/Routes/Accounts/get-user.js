const handleGetUser = async (req, res, db) => {
    try {
        const id = req.params.id;
        const account = await db('accounts').where({ id }).select('id', 'email', 'role', 'created_at', 'updated_at', 'name')
    
        if (!account) {
          return res.status(404).send('Account not found');
        }
    
        res.status(200).json(account)
      } catch (error) {
        console.error('Error retrieving the account:', error);
        res.status(500).send('Internal server error.');
      }
}

export default { handleGetUser }