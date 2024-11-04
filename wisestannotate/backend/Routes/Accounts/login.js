const handleLogin = async (req, res, db, bcrypt, generateToken) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db('accounts').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = generateToken(userInfo);

    res.json({ token, user: userInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default { handleLogin };
