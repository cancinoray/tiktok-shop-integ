import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "koa-logger";
import router from "./routes";
import { config } from "./config";
import views from "koa-views";
import path from "path";
import koaStatic from "koa-static";
import cookie from "koa-cookie";

const app = new Koa();
const PORT = config.port;

// Body Parsing Middleware
app.use(bodyParser());

// View Engine Middleware
// app.use(
//     views(path.join(__dirname, 'views'), {
//         extension: 'pug'
//     })
// )

// Static Files Middleware
app.use(koaStatic(path.join(__dirname, "statics")));

app.use(cors());
app.use(logger());
app.use(cookie());
app.use(router.routes());
app.use(router.allowedMethods());

const server = app
  .listen(PORT, async () => {
    console.log(`Server is listening on port: ${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
  });

export default server;
