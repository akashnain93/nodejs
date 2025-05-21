import { app } from "./app.js";
const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log("Sever is Up");
});
