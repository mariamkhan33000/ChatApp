import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '30d' });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        return token;
    } catch (error) {
        console.error("Error generating token:", error.message);
        res.status(500).json({ message: "Failed to generate token" });
    }
};
