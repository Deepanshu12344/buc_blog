import jwt from 'jsonwebtoken';

export const verifyToken = async (request, response, next) => {
    try {
        let token = request.header("Authorization"); // Change const to let

        if (!token) return response.status(403).send("Access Denied"); // Corrected typo from 'ssend' to 'send'

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        request.user = verified; // Attach verified user information to the request object
        next(); // Call next to proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error"); // Handle any errors
    }
};
