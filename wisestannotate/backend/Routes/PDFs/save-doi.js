const handleSaveDoi = async (req, res, db) => {
    try {
      const { doi, file_name } = req.body;
      if (!doi || !file_name) {
        return res.status(400).json({ error: 'DOI and file_name are required' });
      }
  
      // Check if the entry already exists in the database
      const existingEntry = await db('doi_table').where({ doi, file_name }).first();
      if (existingEntry) {
        return res.status(400).json({ error: 'DOI and file name already exist in the database' });
      }
  
      // If not exists, insert into the database
      await db('doi_table').insert({ doi, file_name });
  
      res.status(200).json({ message: 'DOI and file name saved successfully' });
    } catch (error) {
      console.error('Error saving DOI and file name:', error);
      res.status(500).send('Internal server error.');
    }
  };
  
  export default { handleSaveDoi };
  