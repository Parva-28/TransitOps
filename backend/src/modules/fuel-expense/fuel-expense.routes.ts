// ============================================================================
// modules/fuel-expense/fuel-expense.routes.ts  — BB owns
// Mounted at /api — serves /fuel, /expenses, /operations/cost-summary
// ============================================================================
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { listFuelHandler, createFuelHandler, listExpensesHandler, createExpenseHandler, costSummaryHandler } from './fuel-expense.controller';

export const fuelExpenseRouter = Router();
fuelExpenseRouter.use(requireAuth);

fuelExpenseRouter.get('/fuel',    listFuelHandler);       // GET  /api/fuel
fuelExpenseRouter.post('/fuel',   createFuelHandler);     // POST /api/fuel
fuelExpenseRouter.get('/expenses',  listExpensesHandler); // GET  /api/expenses
fuelExpenseRouter.post('/expenses', createExpenseHandler);// POST /api/expenses
fuelExpenseRouter.get('/operations/cost-summary', costSummaryHandler); // GET /api/operations/cost-summary
