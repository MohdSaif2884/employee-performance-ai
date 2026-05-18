const asyncHandler = require('../utils/asyncHandler');
const Employee = require('../models/Employee');
const aiService = require('../services/aiService');

function toPlainEmployees(employees) {
  return employees.map((e) => ({
    id: e._id,
    name: e.name,
    email: e.email,
    department: e.department,
    skills: e.skills,
    performanceScore: e.performanceScore,
    experience: e.experience
  }));
}

exports.recommend = asyncHandler(async (req, res) => {
  const { employeeIds, department, mode } = req.body;

  if (mode && !['promotion', 'ranking', 'training', 'feedback'].includes(mode)) {
    return res.status(400).json({ message: 'Invalid mode. Use promotion, ranking, training, or feedback.' });
  }

  if (!employeeIds && !department) {
    return res.status(400).json({ message: 'Provide employeeIds or department' });
  }


  let employees = [];

  if (employeeIds && Array.isArray(employeeIds) && employeeIds.length > 0) {
    employees = await Employee.find({ _id: { $in: employeeIds } });
  } else if (department && typeof department === 'string') {
    employees = await Employee.find({ department });
  }

  if (employees.length === 0) {
    return res.status(404).json({ message: 'No employees found for given criteria' });
  }

  const payloadEmployees = toPlainEmployees(employees);

  const aiResult = await aiService.recommend({ employees: payloadEmployees, mode });

  res.json({ ok: true, ...aiResult });
});

