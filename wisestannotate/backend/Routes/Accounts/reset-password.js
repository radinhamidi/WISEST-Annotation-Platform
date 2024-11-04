import bcrypt from 'bcrypt';

const handleResetPassword = async (req, res, db) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Fetch user with the provided reset token and check if it's valid
    const user = await db('accounts').where({ reset_token: token }).andWhere('reset_expires', '>', new Date()).first();
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database and clear the reset token fields
    await db('accounts')
      .where({ reset_token: token })
      .update({
        password_hash: hashedPassword,
        reset_token: null,
        reset_expires: null,
      });

    // Send success response
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    // Handle any errors
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export default { handleResetPassword };
