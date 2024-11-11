const prisma = require("../config/database");

const createNote = async (data) => {
  return prisma.notes.create({
    data: data,
  });
};

const getAllNote = async () => {
  return prisma.notes.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findNoteById = async (id) => {
  return prisma.notes.findFirst({
    where: { id: id },
  });
};

const deleteNoteById = async (id) => {
  return prisma.notes.delete({
    where: { id: id },
  });
};

const updateNote = async (id, data) => {
  return prisma.notes.update({
    where: { id: id },
    data: data,
  });
};

module.exports = {
  createNote,
  getAllNote,
  findNoteById,
  updateNote,
  deleteNoteById,
};
