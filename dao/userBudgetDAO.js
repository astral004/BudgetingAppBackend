import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;
// {
//     "_id": ObjectId("60f7a1f76d0fca1388a85db3"),
//     "userGoogleId": "60f7a1f76d0fca1388a85db1",
//     "totalBudget": 2000,
//     "budgetBreakdown": [
//         {
//             "categoryId": ObjectId("60f7a1f76d0fca1388a85db2"),
//             "allocatedPercent": 20,
//         },
//         others...
//     ]
// }

let userBudgetCollection;

export default class UserBudgetDAO {
    static async injectDB(conn) {
        if (userBudgetCollection) {
            return;
        }
        try {
            userBudgetCollection = await conn.db(process.env.BUDGET_COLLECTION).collection("user_budget");
        }
        catch(e) {
            console.error(`Unable to connect in UserBudgetDAO: ${e}`);
        }
    }

    static async addBudget(userId, budget, budgetBreakdown) {
        budgetBreakdown.map(budget => {
           budget.categoryId = new ObjectId(budget.categoryId);
        });
        try {
            const budgetDoc = {
                userGoogleId: userId, 
                totalBudget: budget,
                budgetBreakdown: budgetBreakdown
              };
            return await userBudgetCollection.insertOne(budgetDoc);
        } catch (e) {
            console.error(`Unable to add new user budget: ${e}`);
            return { error: e };
        }
    }

    static async updateBudget(budgetId, userId, budget, budgetBreakdown) {
        try {
            const updateDoc = {
                $set: {
                  totalBudget: budget,
                  budgetBreakdown: budgetBreakdown
                },
              };
            const updatedBudget = await userBudgetCollection.updateOne(
                { _id: new ObjectId(budgetId)},
                updateDoc
            );
            return updatedBudget;
        } catch (e) {
            console.error(`Unable to update user budget: ${e}`);
            return { error: e };
        }
    }

    static async getUserBudgets(googleId) {
        try {
            const budgetBreakdown = await userBudgetCollection.findOne({ userGoogleId: googleId });
            if (!budgetBreakdown) {
                return { error: "No budget found for this user." };
            }
            return budgetBreakdown;

        } catch (e) {
            console.error(`Unable to retrieve budget breakdown for user: ${e}`);
            return { error: e };
        }
    }
}