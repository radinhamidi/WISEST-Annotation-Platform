const handleCheckDoiExists = async (req, res, db) => {
    try {
      const { doi } = req.body;
  
      // Query the database to check if the DOI exists
      const existingEntry = await db('doi_table').where({ doi }).first();
  
      if (existingEntry) {
        res.status(200).json({ exists: true, message: `The DOI ${doi} already exists` });
      } else {
        res.status(200).json({ exists: false, message: `The DOI ${doi} does not exist` });
      }
    } catch (error) {
      console.error('Error checking DOI existence:', error);
      res.status(500).send('Internal server error.');
    }
  };
  
  export default { handleCheckDoiExists };
  