export default function Lab5(app) {
  const lab5Hello = (req, res) => {
    res.send("Welcome to Lab 5");
  }
  app.get("/lab5/welcome",lab5Hello);
};
