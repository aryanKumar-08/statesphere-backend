// // import generateTokenAndSetCookie from "../lib/utils/generateToken.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcrypt";
// import jwt from 'jsonwebtoken'


// // sign up controller
// export const registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//             return res.json({
//                 success: false,
//                 message: "Please fill all the details"
//             })
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // to check if email is in correct format
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({ error: "Invalid email format" });
//         }

//         // if user already exists
//         const userExist = await User.findOne({ username });
//         if (userExist) {
//             return res.json({
//                 success: false,
//                 error: "user already exists"
//             })
//         }

//         const emailExist = await User.findOne({ email });
//         if (emailExist) {
//             return res.json({
//                 success: false,
//                 error: "email already exists"
//             })
//         }


//         if (password.length < 6) {
//             return res.json({ success: false, message: "password must be atleast 6 character long" })
//         }

//         // hashing the password passed by the user
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(password, salt);

//         // now creating new user

//         const newUser = new User(
//             {
//                 username: username,
//                 email: email,
//                 password: hashPassword
//             }
//         )
//         if (newUser) {

          
//             await newUser.save();
//             res.status(201).json({

//                 _id: newUser._id,
               
//                 email: newUser.email,
              
//           })
//        }
//         else {

//             res.status(401).json({
//                 success: false,
//                 message: "error in user creation"
//             })



//         }
       
        
    
       


        

//     } catch (error) {

//         console.log("Error in signUp");

//         res.json({
//             success: false,
//             message: error.message

//         }
//         )

//     }

// };
    
// // login controller for the user
// export const loginUser = async (req, res) => {
//     try {

//      const {username, password} = req.body;

//      if(!username || !password){
//          return res.json({success:false, message: "fill the details"});
//      }
//      const user =  await User.findOne({username});
//      if(!user){
//          return res.json({success:false, message: "user does not exist"});
//      }
     
//      // check if password is correct
//      const isPasswordCorrect = await bcrypt.compare(password, user.password);
//      if(!isPasswordCorrect){
//          return  res.status(400).json({success:false, message:"incorrect password"})
//      }
//      const token = jwt.sign({id:user.id , isAdmin : true}, process.env.JWT_SECRET, {
//         expiresIn: 15*24*60*60*1000
//     })
//     const { password: userPassword, ...userInfo } = user.toObject();

//     res.cookie("token", token, {
//         maxAge: 15*24*60*60*1000,
//         httpOnly: true
//     })
//     .status(201)
//     .json(
//         userInfo
//     )
//     } catch (error) {
//      console.log("error in login controller");
//      res.json({
//          success:false,
//          message: error.message
//      })
     
//     }
//  };

//  export const logoutUser = (req, res) => {
//     res.clearCookie("token").status(200).json({ message: "Logout Successful" });
//   };


import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// sign up controller
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.json({
                success: false,
                message: "Please fill all the details"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // to check if email is in correct format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // if user already exists
        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.json({
                success: false,
                error: "user already exists"
            });
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.json({
                success: false,
                error: "email already exists"
            });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "password must be at least 6 characters long" });
        }

        // hashing the password passed by the user
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // now creating new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashPassword
        });

        if (newUser) {
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
            });
        } else {
            res.status(401).json({
                success: false,
                message: "error in user creation"
            });
        }

    } catch (error) {
        console.log("Error in signUp");
        res.json({
            success: false,
            message: error.message
        });
    }
};

// login controller for the user
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ success: false, message: "fill the details" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ success: false, message: "user does not exist" });
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "incorrect password" });
        }

        const token = jwt.sign({ id: user.id, isAdmin: true }, process.env.JWT_SECRET, {
            expiresIn: 15 * 24 * 60 * 60 * 1000 // 15 days
        });

        const { password: userPassword, ...userInfo } = user.toObject();

        res.cookie("token", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // true only in production (HTTPS)
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" // 'none' for cross-site in production
        })
        .status(201)
        .json(userInfo);

    } catch (error) {
        console.log("error in login controller");
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }).status(200).json({ message: "Logout Successful" });
};



