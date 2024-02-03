// {
//     "_id": ObjectId("60f7a1f76d0fca1388a85db4"),
//     "userGoogleId": "1234567890",
//     "categoryId": ObjectId("60f7a1f76d0fca1388a85db2"),
//     "transactionName": "Groceries",
//     "amount": 150,
//     "transactionDate": "2023-07-01T00:00:00Z",
// }
import {ObjectId} from "mongodb";

let expensesCollection;

export default class ExpensesDAO {
    static async injectDB(conn) {
        if (expensesCollection) {
            return;
        }
        try {
            expensesCollection = await conn.db(process.env.BUDGET_COLLECTION).collection("expenses");
        }
        catch(e) {
            console.error(`Unable to connect in ExpensesDAO: ${e}`);
        }
    }

    static async addExpense(userGoogleId, categoryId, transactionName, amount, transactionDate) {
        try {
            const expense = {
                userGoogleId: userGoogleId,
                categoryId: new ObjectId(categoryId),
                transactionName: transactionName,
                amount: parseInt(amount),
                transactionDate: transactionDate,
            }
            
            return await expensesCollection.insertOne(expense);
        } catch (e) {
            console.error(`Unable to add new user budget: ${e}`);
            return { error: e };
        }
    }

    static async getExpenseByMonth(googleId, month, year) {
        try{
            const expenses = await expensesCollection.aggregate([
                {
                    $project: {
                        _id: "$_id",
                        userGoogleId: "$userGoogleId",
                        categoryId: "$categoryId",
                        transactionName: "$transactionName",
                        amount: "$amount",
                        month:{$month: "$transactionDate"},
                        year: {$year: "$transactionDate"}
                    }
                },
                {
                    $match: {userGoogleId: googleId, month: parseInt(month), year: parseInt(year)}
                }
            ]).toArray();

            if (expenses.length > 0) {
                return expenses;
            } else {
                return 0;
            }
        } catch (e) {
            console.error(`Unable to get total expense for user: ${e}`);
            return { error: e };
        }
    }

    static async getTotalExpenseForUser(googleId) {
        try {
            const expenses = await expensesCollection.aggregate([
                {
                    $match: {userGoogleId: googleId}
                },
                {
                    $group: {_id: "$userGoogleId", totalExpense: {$sum: "$amount"} }
                }
            ]).toArray();

            if (expenses.length > 0) {
                return expenses[0].totalExpense;
            } else {
                return 0;
            }
        } catch (e) {
            console.error(`Unable to get total expense for user: ${e}`);
            return { error: e };
        }
    }

    static async getExpensesForUser(googleId) {
        
        try {
            const expenses = await expensesCollection.find({ userGoogleId: googleId }).toArray();
            
            if (expenses.length > 0) {
                return expenses;
            } else {
                return [];
            }
        } catch (e) {
            console.error(`Unable to retrieve expenses for user: ${e}`);
            return { error: e };
        }
    }
}
