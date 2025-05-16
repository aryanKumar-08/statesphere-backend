// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) return res.status(401).json({ message: "Not Authenticated!" });

//   jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
//     if (err) return res.status(403).json({ message: "Token is not Valid!" });
//     req.userId = payload.id;

//     next();
//   });
// };


import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ message: "Not authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ message: "Invalid token!" });
    }
    req.userId = payload.id;
    next();
  });
};



