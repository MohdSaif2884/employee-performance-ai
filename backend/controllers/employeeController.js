const asyncHandler = require('../utils/asyncHandler');
const Employee = require('../models/Employee');

exports.createEmployee = asyncHandler(async (req, res) => {
  const { name, email, department, skills, performanceScore, experience } = req.body;

  const employee = await Employee.create({
    name,
    email,
    department,
    skills: Array.isArray(skills) ? skills : [],
    performanceScore,
    experience
  });

  res.status(201).json(employee);
});

exports.getEmployees = asyncHandler(async (req, res) => {
  const { department, minScore, maxScore } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (minScore !== undefined) filter.performanceScore = { ...(filter.performanceScore || {}), $gte: Number(minScore) };
  if (maxScore !== undefined) filter.performanceScore = { ...(filter.performanceScore || {}), $lte: Number(maxScore) };

  const employees = await Employee.find(filter).sort({ performanceScore: -1, createdAt: -1 });
  res.json(employees);
});

exports.getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json(employee);
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, department, skills, performanceScore, experience } = req.body;

  const updated = await Employee.findByIdAndUpdate(
    id,
    {
      name,
      email,
      department,
      skills: Array.isArray(skills) ? skills : [],
      performanceScore,
      experience
    },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: 'Employee not found' });
  res.json(updated);
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Employee.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Employee not found' });
  res.json({ message: 'Deleted', id: deleted._id });
});

exports.searchByDepartment = asyncHandler(async (req, res) => {
  const { department } = req.query;
  if (!department) return res.status(400).json({ message: 'department query parameter is required' });

  const employees = await Employee.find({ department }).sort({ performanceScore: -1 });
  res.json(employees);
});

