// {
//     "_id": ObjectId("60f7a1f76d0fca1388a85db2"),
//     "categoryName": "Food & Dining"
// }

import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let categoryCollection;

export default class BudgetCategoriesDAO {
    static async injectDB(conn) {
        if (categoryCollection) {
            return;
        }
        try {
            categoryCollection = await conn.db(process.env.BUDGET_COLLECTION).collection("budget_categories");
        }
        catch(e) {
            console.error(`Unable to connect in BudgetCategoriesDAO: ${e}`);
        }
    }

    static async getCategories() {
        let categories = [];
        try {
            categories =  await categoryCollection.find({}, { _id: 1, categoryName: 1 }).toArray();
            return categories;
        } catch (e) {
            console.error(`Unable to get categories: ${e}`);
            return { error: e };
        }
    }

    static async getCategoryById(id){
        try {
            return await categoryCollection.findOne(
                {_id: new ObjectId(id)}
            );
        }
        catch (e) {
            console.error(`Unable to get categories: ${e}`);
            return { error: e };
        }
    }
}