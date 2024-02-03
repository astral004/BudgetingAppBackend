import UsersDAO from "../dao/usersDAO.js";

export default class UsersController {
    static async apiPostUser(req, res, next) {
        try {
            const name = req.body.name;
            const email = req.body.email;
            const date = new Date();
            const googleId = req.body.googleId;

            const response = await UsersDAO.addUser(
                name,
                email,
                date,
                googleId
            );

            const { error } = response;

            if (error) {
                res.status(500).json({ error: "Unable to post user." });
            } else {
                res.json({
                    status: "success",
                    response: response,
                });
            }

        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetUser(req, res, next) {
        try {
            const googleId = req.params.googleId;
    
            const response = await UsersDAO.getByGoogleId(googleId);
    
            const { error } = response;
    
            if (error) {
                res.status(404).json({ error: "Unable to find user." });
            } else {
                res.json({
                    status: "success",
                    user: response,
                });
            }
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiPutUser(req, res, next) {
        try {
            const {googleId} = req.params;
            const { name, email } = req.body;
            const response = await UsersDAO.updateUser(name, email, googleId);
            let {error} = response;
            if(error) {
                res.status(500).json({error: "Unable to update user."});
            } else {
                res.json(
                    {
                        status: 'success',
                        response: response
                    }
                )
            }
        } catch (e) {
            res.status(500).json(
                {
                    error: e
                }
            );
        }
    }
}