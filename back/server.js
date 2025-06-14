// server.js
const express = require('express');
const crypto = require('crypto');
const openDb = require('./database.js');

const app = express();
app.use(express.json()); // Middleware para o servidor entender JSON

const PORT = 3000;

// --- ROTAS DE USUÁRIO (CADASTRO E LOGIN) ---

app.post('/register', async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
  }

  const db = await openDb();
  const existingUser = await db.get('SELECT * FROM users WHERE userName = ?', [userName]);
  if (existingUser) {
    return res.status(409).json({ error: 'Este nome de usuário já está em uso.' });
  }
  
  const password_hash = crypto.createHash('sha256').update(password).digest('hex');
  
  try {
    const result = await db.run('INSERT INTO users (userName, password_hash) VALUES (?, ?)', [userName, password_hash]);
    res.status(201).json({ id: result.lastID, userName: userName });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário.', details: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
  }

  const db = await openDb();
  const user = await db.get('SELECT * FROM users WHERE userName = ?', [userName]);
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const hashedAttempt = crypto.createHash('sha256').update(password).digest('hex');

  if (hashedAttempt === user.password_hash) {
    res.status(200).json({ id: user.id, userName: user.userName });
  } else {
    res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }
});

// --- ROTAS DE EVENTOS ---

app.get('/users/:userId/events', async (req, res) => {
  const { userId } = req.params;
  const db = await openDb();
  const events = await db.all('SELECT * FROM events WHERE userId = ? ORDER BY id DESC', [userId]);
  res.status(200).json(events);
});

app.post('/events', async (req, res) => {
    const { name, date, category, description, manualLocation, gpsLocation, imageUrl, userId } = req.body;
    if (!name || !date || !userId) {
        return res.status(400).json({ error: 'Nome, data e ID do usuário são obrigatórios.' });
    }
    const db = await openDb();
    try {
        const result = await db.run(
            'INSERT INTO events (name, date, category, description, manualLocation, gpsLocation, imageUrl, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, date, category, description || '', manualLocation, gpsLocation, imageUrl, userId]
        );
        const newEvent = await db.get('SELECT * FROM events WHERE id = ?', result.lastID);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar evento.', details: error.message });
    }
});

app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, category, description, manualLocation, gpsLocation, imageUrl, userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'O ID do usuário é obrigatório.' });
    
    const db = await openDb();
    const event = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado.' });
    if (event.userId !== userId) return res.status(403).json({ error: 'Acesso negado.' });

    try {
        await db.run(
            'UPDATE events SET name = ?, date = ?, category = ?, description = ?, manualLocation = ?, gpsLocation = ?, imageUrl = ? WHERE id = ?',
            [name, date, category, description, manualLocation, gpsLocation, imageUrl, id]
        );
        const updatedEvent = await db.get('SELECT * FROM events WHERE id = ?', [id]);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar evento.', details: error.message });
    }
});

app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'O ID do usuário é obrigatório.' });

    const db = await openDb();
    const event = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado.' });
    if (event.userId !== userId) return res.status(403).json({ error: 'Acesso negado.' });

    try {
        await db.run('DELETE FROM events WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar evento.', details: error.message });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});