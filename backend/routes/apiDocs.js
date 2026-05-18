exports.getDocs = (req, res) => {
  res.json({
    endpoints: {
      auth: ['/api/auth/signup', '/api/auth/login'],
      employees: ['/api/employees', '/api/employees/:id', '/api/employees/search?department=Development'],
      ai: ['/api/ai/recommend']
    }
  });
};

