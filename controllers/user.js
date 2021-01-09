const User = require("../models/user");

exports.getUser = (req, res, next) => {
    User.findById(req.userId)
        .select("-password")
        .populate(["orders", "address"])
        .then((user) => {
            if (!user) {
                const error = new Error("User not found.");
                error.statusCode = 401;
                throw error;
            }
            res.status(200).json({
                message: "fetched user successfully.",
                user: user,
            });
        });
};
