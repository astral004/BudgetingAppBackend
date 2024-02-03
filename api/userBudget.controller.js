import UserBudgetDAO from "../dao/userBudgetDAO.js";
import BudgetCategoriesDAO from "../dao/categoriesDAO.js";

export default class UserBudgetController {

    static async apiPostBudget(req, res, next) {
        try {
            const userId = req.body.userGoogleId;
            const budgetValue = req.body.totalBudget;
            const budgetBreakdown = req.body.budgetBreakdown

            const budgetResponse = await UserBudgetDAO.addBudget(userId, budgetValue, budgetBreakdown);
            var {error} = budgetResponse;

            if (error) {
                res.status(500).json({ error: "Unable to post user budget." });
            } else {
                res.json({
                    status: "success",
                    response: budgetResponse, 
                });
            }
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiUpdateBudget(req, res, next) {
        try {
            const budgetId = req.body._id;
            const userId = req.body.userGoogleId; 
            const budgetValue = req.body.totalBudget;
            const budgetBreakdown = req.body.budgetBreakdown

            const updatedBudget = await UserBudgetDAO.updateBudget(budgetId, userId, budgetValue, budgetBreakdown);
            if (updatedBudget.matchedCount > 0) {
                res.json({
                    status: "success",
                    updatedBudget: req.body,
                });
            } else {
                res.status(500).json({ error: "Unable to update budget." });
            }
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiGetBudgets(req, res, next) {
        try {
            const googleId = req.params.googleId || {};

            const budgets = await UserBudgetDAO.getUserBudgets(googleId);

            res.json(budgets);

        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetBudgets(req, res, next) {
        try {
            const googleId = req.params.googleId || {};

            const budgets = await UserBudgetDAO.getUserBudgets(googleId);

            if (budgets.error) {
                res.status(500).json({ error: "Unable to get budgets." });
            } else {
                res.json({
                    status: "success",
                    budgets: budgets,
                });
            }

        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}
