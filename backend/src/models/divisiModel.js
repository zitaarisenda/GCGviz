const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/divisi.json');

function readData() {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]');
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

exports.getAll = () => readData();

exports.getById = (id) => readData().find(d => d.id === id);

exports.create = ({ nama }) => {
  const data = readData();
  const newDivisi = {
    id: Date.now(),
    nama,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  data.push(newDivisi);
  writeData(data);
  return newDivisi;
};

exports.update = (id, { nama }) => {
  const data = readData();
  const idx = data.findIndex(d => d.id === id);
  if (idx === -1) return null;
  data[idx].nama = nama;
  writeData(data);
  return data[idx];
};

exports.delete = (id) => {
  const data = readData();
  const idx = data.findIndex(d => d.id === id);
  if (idx === -1) return false;
  data.splice(idx, 1);
  writeData(data);
  return true;
}; 