const Direksi = require('../models/direksiModel');

exports.getAllDireksi = (req, res) => {
  const data = Direksi.getAll();
  res.json(data);
};

exports.getDireksiById = (req, res) => {
  const id = parseInt(req.params.id);
  const direksi = Direksi.getById(id);
  if (!direksi) return res.status(404).json({ message: 'Direksi not found' });
  res.json(direksi);
};

exports.createDireksi = (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json({ message: 'Nama is required' });
  const newDireksi = Direksi.create({ nama });
  res.status(201).json(newDireksi);
};

exports.updateDireksi = (req, res) => {
  const id = parseInt(req.params.id);
  const { nama } = req.body;
  const updated = Direksi.update(id, { nama });
  if (!updated) return res.status(404).json({ message: 'Direksi not found' });
  res.json(updated);
};

exports.deleteDireksi = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = Direksi.delete(id);
  if (!deleted) return res.status(404).json({ message: 'Direksi not found' });
  res.json({ message: 'Direksi deleted' });
}; 