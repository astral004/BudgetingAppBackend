import BudgetCategoriesDAO from "../dao/categoriesDAO.js";

export default class CategoriesController {
    static async apiGetCategories(req, res, next) {
        try {
            let categories = await BudgetCategoriesDAO.getCategories();

            res.json(categories);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e});
        }
    }

    static async apiGetCategoryById(req, res, next){
        try{
            let category =  await BudgetCategoriesDAO.getCategoryById(req.params.id);
            res.json(category);
        }catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e});
        }
    }
    
}