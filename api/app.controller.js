export default class AppController {
    static async apiGetRoot(req, res, next){
       res.json({hello: "Hello world!"})
    }
}