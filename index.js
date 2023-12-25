import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import { kpis, products, transactions } from "./data/data.js";
// mongoose.Promise = global.Promise; // чтобы убрать mpromise (mongoose's default promise library) is deprecated,

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

console.log('hello')

/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

// /* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
const { BASE_PATH = 'localhost' } = process.env;
// этот метод принимает на вход адрес сервера БД
// mongodb://localhost:27017 — адрес сервера mongo по умолчанию. Он запускается на localhost на 27017 порту.
mongoose.connect(process.env.MONGO_URL, {
  // useMongoClient:true позволяет избежать ошибки `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead
  // если версия mongoose в package.json больше 5.0, то useNewUrlParser and useUnifiedTopology instead.
  useNewUrlParser:true,
  useUnifiedTopology:true
})
  .then(async () => {
    app.listen(PORT, () => console.log(`App listening on: ${BASE_PATH}:${PORT}`));

    /* ADD DATA ONE TIME ONLY OR AS NEEDED */
    // Удаляет всю информацию из БД. Нужно только для первоначального тестирования.
    await mongoose.connection.db.dropDatabase();
    // Вставляет данные из data.js
    KPI.insertMany(kpis);
    Product.insertMany(products);
    Transaction.insertMany(transactions);
  })
  .catch((error) => console.log(`${error} did not connect`));
