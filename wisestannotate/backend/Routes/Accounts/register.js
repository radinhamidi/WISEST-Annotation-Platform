const handleRegister = async (req, res, db, bcrypt, generateToken) => {
    try {
      const { email, name, password } = req.body;
  
      // Check if email or password is missing
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Check if the email already exists in the database
      const existingUser = await db('accounts').where({ email }).first();
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new user into the database with 'Pending' role
      await db('accounts').insert({
        email,
        password_hash: hashedPassword,
        role: 'Pending',
        name: name
      });
  
      const user = await db('accounts').where({ email }).select('id', 'email', 'role', 'name').first();
  
      const userInfo = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
  
      const token = generateToken(userInfo);
  
      res.status(201).json({ message: 'User registered successfully', token, user: userInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  export default { handleRegister };
  