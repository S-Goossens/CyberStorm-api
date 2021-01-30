const User = require("../models/user");

module.exports = async (req, res, next) => {
    const userId = req.userId;
    try {
        await User.findById(userId).then((user) => {
            if (!user) {
                const error = new Error("Not authenticated");
                error.statusCode = 401;
                throw error;
            }
            // if (!user.isAdmin) {
            //     const error = new Error("Unauthorized");
            //     error.statusCode = 403;
            //     throw error;
            // }
            req.isAdmin = user.isAdmin;
        });
        next();
    } catch (err) {
        next(err);
    }
};
