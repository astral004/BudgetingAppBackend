// {
//     "_id": ObjectId("60f7a1f76d0fca1388a85db1"),
//     "name": "JohnDoe",
//     "email": "johndoe@example.com",
//     "registerDate": "2023-07-31T00:00:00Z",
//     "googleId": "1234567890",
// }

let userCollection;

export default class UsersDAO {
    static async injectDB(conn) {
        if (userCollection) {
            return;
        }
        try {
            userCollection = await conn.db(process.env.BUDGET_COLLECTION).collection("users");
        }
        catch(e) {
            console.error(`Unable to connect in UsersDAO: ${e}`);
        }
    }

    static async addUser(name, email, registerDate, googleId) {
        try {
            const newUser = {
                name: name,
                email: email,
                registerDate: registerDate,
                googleId: googleId
            };
            return await userCollection.insertOne(newUser);
        } catch (e) {
            console.error(`Unable to add user: ${e}`);
            return { error: e };
        }
    }

    static async getByGoogleId(googleId) {
        try {
            const user = await userCollection.findOne({ googleId: googleId });
            if (!user) {
                return { error: "No user found with this username." };
            }
            return user;
        } catch (e) {
            console.error(`Unable to get user: ${e}`);
            return { error: e };
        }
    }

    static async updateUser(name, email, googleId){
        try {
            const response = await userCollection.updateOne(
                {googleId: googleId},
                {$set:
                        {
                            name: name,
                            email: email,
                        }
                }
            );
            if ( response.modifiedCount === 1) {
                return response;
            } else {
                throw new Error("No objects were modified");
            }
        } catch (e) {
            console.error(`Unable to update user: ${e}`);
            return {error: e};
        }
    }
}