const Divisi = require('../models/divisiModel');

exports.getAllDivisi = (req, res) => {
  const data = Divisi.getAll();
  res.json(data);
};

exports.getDivisiById = (req, res) => {
  const id = parseInt(req.params.id);
  const divisi = Divisi.getById(id);
  if (!divisi) return res.status(404).json({ message: 'Divisi not found' });
  res.json(divisi);
};

exports.createDivisi = (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json({ message: 'Nama is required' });
  const newDivisi = Divisi.create({ nama });
  res.status(201).json(newDivisi);
};

exports.updateDivisi = (req, res) => {
  const id = parseInt(req.params.id);
  const { nama } = req.body;
  const updated = Divisi.update(id, { nama });
  if (!updated) return res.status(404).json({ message: 'Divisi not found' });
  res.json(updated);
};

exports.deleteDivisi = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = Divisi.delete(id);
  if (!deleted) return res.status(404).json({ message: 'Divisi not found' });
  res.json({ message: 'Divisi deleted' });
}; 