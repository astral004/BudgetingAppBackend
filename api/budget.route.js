import express from "express";
import CategoriesController from "./categories.controller.js";
import ExpensesController from "./expenses.controller.js";
import UserBudgetController from "./userBudget.controller.js";
import UsersController from "./users.controller.js";
import AppController from "./app.controller.js";


const router = express.Router();

router.route("/").get(AppController.apiGetRoot);
router.route("/user").post(UsersController.apiPostUser)

router.route("/user/:googleId")
    .get(UsersController.apiGetUser)
    .put(UsersController.apiPutUser);

router.route("/categories").get(CategoriesController.apiGetCategories);
router.route("/categories/:id").get(CategoriesController.apiGetCategoryById);


router.route("/expenses").post(ExpensesController.apiPostExpense);
router.route("/expenses/:googleId").get(ExpensesController.apiExpenseByMonth);
router.route("/expenses/:googleId/totalExpense").get(ExpensesController.apiTotalExpense);
router.route("/listExpenses/:googleId").get(ExpensesController.apiGetExpensesForUser);


router.route("/userBudgets").post(UserBudgetController.apiPostBudget);
router.route("/userBudgets").put(UserBudgetController.apiUpdateBudget);
router.route("/budgets/:googleId").get(UserBudgetController.apiGetBudgets);


export default router;
