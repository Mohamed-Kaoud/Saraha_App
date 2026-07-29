import userModel from "../models/user.model.js";
import BaseRepository from "./base.repository.js";

class UserRepository extends BaseRepository {
    constructor() {
        super(userModel)
    }
}

export default new UserRepository()