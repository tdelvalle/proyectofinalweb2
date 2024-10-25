import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Registro de usuario
export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar el usuario' });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
