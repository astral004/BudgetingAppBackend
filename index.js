import mongodb from "mongodb";
import dotenv from "dotenv";
import app from "./server.js";
import BudgetCategoriesDAO from "./dao/categoriesDAO.js";
import ExpensesDAO from "./dao/expensesDAO.js";
import UserBudgetDAO from "./dao/userBudgetDAO.js";
import UsersDAO from "./dao/usersDAO.js";

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(process.env.BUDGET_DB_URI);
    const port = process.env.PORT || 8000;

    try {
        await client.connect();
        await BudgetCategoriesDAO.injectDB(client);
        await ExpensesDAO.injectDB(client);
        await UserBudgetDAO.injectDB(client);
        await UsersDAO.injectDB(client);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}.`);
        });

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);

export default app;
