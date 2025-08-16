const bcrypt = require('bcrypt');

module.exports = (app, db) => {
  app.get('/api/profile', async (req, res) => {
    try {
      const result = await db.query(
        'SELECT id, username, email, first_name, last_name, role FROM users WHERE id = $1',
        [1] // Hardcoded user ID for foundation phase
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/profile', async (req, res) => {
    const { first_name, last_name, email } = req.body;
    try {
      const result = await db.query(
        'UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = NOW() WHERE id = $4 RETURNING id, username, email, first_name, last_name, role',
        [first_name, last_name, email, 1]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/profile/change-password', async (req, res) => {
    const { current_password, new_password } = req.body;
    try {
      const userResult = await db.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [1]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const isValid = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid current password' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(new_password, salt);
      
      await db.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newHash, 1]
      );
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: error.message });
    }
  });
};
