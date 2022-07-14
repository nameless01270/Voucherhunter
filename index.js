import express from "express";
import mongoose from  "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import vouchersRoute from "./routes/vouchers.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import categoriesRoute from "./routes/categories.js";
import ordersRoute from "./routes/orders.js";
import adminRoute from "./routes/admin.js";

const app = express();
dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connect database success...");
    }
    catch(error) {
        console.log("Connect database failed...");
        console.log(error);
    }
}

//MiddleWares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/vouchers", vouchersRoute);
app.use("/api/users", usersRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/orders/", ordersRoute);
app.use("/api/admin/", adminRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connectDb();
  console.log("Connected to backend.");
});