import express from 'express';
import authRoute from './routes/auth.route.js';
import cors from 'cors'
import connectDB from './config/mongodb.js';
import dotenv from 'dotenv';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import chatRoute from './routes/chat.route.js';
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 4000
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({origin:process.env.CLIENT_URL , credentials: true}));
await connectDB();

app.use("/api/auth", authRoute );
app.use("/api/test", testRoute );
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute );


app.listen(PORT, ()=> console.log("api is running on the port " + PORT) );