import storage from './storage'
class userEx {
    async IsLogin() {
        let TOKEN = await storage.get("TOKEN");
        if (TOKEN) {
            return TOKEN;
        } else {
            return false;
        }
    }

    async GetUser() {
        let USER = await storage.get("USER");
        if (USER) {
            return USER;
        } else {
            return false;
        }
    }

    SetUser(user) {
        storage.save("USER", user)
    }

    SetToken(token) {
        storage.save("TOKEN", token)
    }

    LoginOk(user, token) {
        storage.save("USER", user)
        storage.save("TOKEN", token)
    }

    LoginOut(user, token) {
        storage.remove("USER")
        storage.remove("TOKEN")
    }
}
const USER = new userEx();
export default USER;