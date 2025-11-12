export default function PathParameters(app) {
 const add = (req, res) => {
   const { a, b } = req.params;
   const sum = parseInt(a) + parseInt(b);
   res.send(sum.toString());
 };
 const subtract = (req, res) => {
   const { a, b } = req.params;
   const difference = parseInt(a) - parseInt(b);
   res.send(difference.toString());
 };
 app.get("/lab5/add/:a/:b", add);
 app.get("/lab5/subtract/:a/:b", subtract);
};
