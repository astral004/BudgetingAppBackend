import ExpensesDAO from "../dao/expensesDAO.js";

export default class ExpensesController {
    static async apiPostExpense(req, res, next) {
        try {
            const {userGoogleId, categoryId, transactionName, amount} = req.body;
            const transactionDate = new Date();

            const response = await ExpensesDAO.addExpense(
                userGoogleId,
                categoryId,
                transactionName,
                amount,
                transactionDate
            );

            const { error } = response;

            if (error) {
                res.status(500).json({ error: "Unable to post expense." });
            } else {
                res.json({
                    status: "success",
                    response,
                });
            }

        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiExpenseByMonth(req, res, next) {
        try {
            const {month, year} = req.query;
            const {googleId} = req.params
            const response = await ExpensesDAO.getExpenseByMonth(googleId, month, year);

            let{error} = response;

            if (error) {
                res.status(500).json({ error: "Unable to get monthly expense." });
            } else {
                res.json({
                    status: "success",
                    response,
                });
            }

        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e});
        }
    }

    static async apiTotalExpense(req, res, next) {
        try {
            const googleId = req.params.googleId;
            const response = await ExpensesDAO.getTotalExpenseForUser(googleId);

            let {error} = response;

            if (error) {
                res.status(500).json({ error: "Unable to get total expense." });
            } else {
                res.json({
                    status: "success",
                    totalAmount: response,
                });
            }
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetExpensesForUser(req, res, next) {
        try {
            const googleId = req.params.googleId || {};
            const expenses = await ExpensesDAO.getExpensesForUser(googleId);

            if (expenses.error) {
                res.status(500).json({ error: "Unable to get expenses." });
            } else {
                res.json({
                    status: "success",
                    expenses: expenses,
                });
            }

        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}