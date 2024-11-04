const handleDeleteUser = async (req, res, db) => {
    const { id } = req.params;
    try {
      const deletedRows = await db('accounts').where({ id }).del();
      if (deletedRows) {
        res.json({ success: true, message: 'User deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'An error occurred while deleting the user', error });
    }
  };
  
  export default {
    handleDeleteUser
  };
  