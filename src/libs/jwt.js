import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config.js";

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, TOKEN_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};