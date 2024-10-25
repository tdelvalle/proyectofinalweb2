import Task from '../models/Task.js';

// Crear nueva tarea
export const createTask = async (req, res) => {
  const { title, description } = req.body;
  const newTask = new Task({ title, description, userId: req.user.id });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

// Obtener tareas
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

// Actualizar tarea
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { title, description, completed }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

// Eliminar tarea
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};
