const handleExecuteSql = async (req, res, db) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'No query provided' });
    }
  
    try {
      const result = await db.raw(query) ;
      res.json(result[0]); // knex returns result in an array
    } catch (error) {
      console.error('SQL execution error:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export default { handleExecuteSql };
  