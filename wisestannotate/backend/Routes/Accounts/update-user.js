const handleUpdateUser = async (req, res, db) => {
    try {
        const { email, name, role } = req.body;
        const id = req.params.id;

        // Check if email, name, or role is missing
        if (!email || !name || !role) {
            return res.status(400).json({ error: 'Email, Name, and Role are required' });
        }

        // Check if user info is already updated with the requested info
        const existingUser = await db('accounts').where({ id }).first();
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the provided values are the same as the existing values
        if (existingUser.email === email && existingUser.name === name && existingUser.role === role) {
            return res.status(400).json({ error: 'No updates needed as the provided values are the same as the current ones' });
        }

        // Only update fields that are different
        const updates = {};
        if (existingUser.email !== email) updates.email = email;
        if (existingUser.name !== name) updates.name = name;
        if (existingUser.role !== role) updates.role = role;

        await db('accounts').where({ id }).update(updates);

        // Fetch the updated user data after the update
        const updatedUser = await db('accounts').where({ id }).first();

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default { handleUpdateUser }
