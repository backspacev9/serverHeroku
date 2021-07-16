import app from "./App";
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
    process.abort();
  }
  console.log(`Server is listening on port ${port}.`);
  console.log(`Ev Port ${process.env.PORT}.`);
  return;
});
