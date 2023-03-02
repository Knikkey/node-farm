const http = require("http");
const fs = require("fs");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

//templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

//data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.forEach(
  (el) => (el.slug = slugify(el.productName, { lower: true }))
);

//routing and display data
const server = http.createServer((req, res) => {
  const myURL = new URL(`http://127.0.0.1:8000${req.url}`);
  const { searchParams, pathname: pathName } = myURL;

  //overview
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);
  }
  //product
  else if (pathName === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj.find((el) => el.id == searchParams.get("id"));
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //api
  else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  //not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});
