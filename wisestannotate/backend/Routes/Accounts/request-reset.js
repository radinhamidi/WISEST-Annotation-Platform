import { sendResetEmail } from '../../utils/email.js';

const generateResetToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const handleRequestReset = async (req, res, db) => {
    const { email } = req.body;
    try {
        const user = await db('accounts').where({ email }).first();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const resetToken = generateResetToken();
        const resetExpires = new Date(Date.now() + 300000); // 5 minutes from now
        await db('accounts')
            .where({ email })
            .update({
                reset_token: resetToken,
                reset_expires: resetExpires,
            });
        await sendResetEmail(email, resetToken);
        res.json({ message: 'Reset token sent to email' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

export default { handleRequestReset };
