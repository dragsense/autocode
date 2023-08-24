

export default async function (req, res, next) {


    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, x-www-form-urlencoded, Content-Length,'Content-Disposition', Content-Type, Accept, Authorization, x-Api-Key"
    );

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTIONS");

  if (req.method == "OPTIONS") {
    return res.status(200).json({});
  }

  next();
}