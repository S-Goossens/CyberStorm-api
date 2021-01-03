const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
            const user = new User({
                email,
                password: hashedPw,
                firstName,
                lastName,
            });
            return user.save();
        })
        .then((result) => {
            const token = generateToken(result.email, result._id.toString());

            res.status(201).json({
                message: "User created!",
                email: result.email,
                userId: result._id,
                _token: token,
                expirationTime: 60 * 60,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const error = new Error(
                    "A user with this email could not be found."
                );
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error("Wrong password.");
                error.statusCode = 401;
                throw error;
            }
            const token = generateToken(
                loadedUser.email,
                loadedUser._id.toString()
            );

            res.status(200).json({
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
                token: token,
                expirationTime: 60 * 60,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

generateToken = (email, userId) => {
    return jwt.sign(
        {
            email: email,
            userId: userId,
        },
        process.env.TOKEN_PRIV,
        { expiresIn: "1h" }
    );
};
