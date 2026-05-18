const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const employeeController = require('../controllers/employeeController');

router.use(authMiddleware);

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.get('/search', employeeController.searchByDepartment);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;

