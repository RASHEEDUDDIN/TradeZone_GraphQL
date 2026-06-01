const mockModel = {
  create: jest.fn().mockResolvedValue({}),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  findByPk: jest.fn().mockResolvedValue(null),
  update: jest.fn().mockResolvedValue([1]),
  destroy: jest.fn().mockResolvedValue(1),
  sync: jest.fn().mockResolvedValue(true),
};

module.exports = {
  authenticate: jest.fn().mockResolvedValue(true),
  define: jest.fn().mockReturnValue(mockModel),
  sync: jest.fn().mockResolvedValue(true),
};
