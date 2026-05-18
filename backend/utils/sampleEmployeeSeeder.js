const Employee = require('../models/Employee');
const sampleEmployees = require('./sampleEmployees');

async function seedSampleEmployees() {
  const emails = sampleEmployees.map((e) => e.email.toLowerCase());

  const existing = await Employee.find({ email: { $in: emails } }).select('email');
  const existingEmails = new Set(existing.map((e) => e.email.toLowerCase()));

  const toInsert = sampleEmployees.filter((e) => !existingEmails.has(e.email.toLowerCase()));
  if (toInsert.length === 0) return { inserted: 0 };

  await Employee.insertMany(
    toInsert.map((e) => ({
      ...e,
      email: e.email.toLowerCase().trim(),
      name: e.name.trim(),
      department: e.department.trim(),
      skills: Array.isArray(e.skills) ? e.skills
        .map((s) => String(s).trim())
        .filter(Boolean) : []
    }))
  );

  return { inserted: toInsert.length };
}

module.exports = seedSampleEmployees;

