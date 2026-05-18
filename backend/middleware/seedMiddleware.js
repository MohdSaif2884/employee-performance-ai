const seedSampleEmployees = require('../utils/sampleEmployeeSeeder');

async function seedMiddleware(req, res, next) {
  // Optional seed trigger: GET /api/seed (protected by admin in real apps).
  if (req.path !== '/seed') return next();

  try {
    const result = await seedSampleEmployees();
    return res.json({ ok: true, ...result });
  } catch (err) {
    return next(err);
  }
}

module.exports = seedMiddleware;

