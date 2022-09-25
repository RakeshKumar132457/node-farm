const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplates');

/*
////////////////////////////////////////////////////////////////////
// FILES
 
// Blocking synchronous code
const text = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(text);
fs.writeFileSync("./txt/output.txt", text);

// Asynchronous code
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
	fs.readFile(`./txt/${data}.txt`, "utf-8", (err, dataNew) => {
		console.log(dataNew);
		fs.readFile("./txt/append.txt", "utf-8", (err, dataThree) => {
			console.log(dataThree);
			fs.writeFile(
				"./txt/final.txt",
				`${dataNew}\n${dataThree}, 'utf-8`,
				(err) => {
					console.log("File has been written");
				}
			);
		});
	});
});
 */

////////////////////////////////////////////////////////////////////
// SERVER

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const productData = JSON.parse(data);

const slug = productData.map((el) => slugify(el.productName, { lower: true }));
console.log(slug);

const server = http.createServer((req, resp) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/' || pathname === '/overview') {
    // Overview
    resp.writeHead(200, {
      'Contest-Type': 'text/html',
    });

    const cardHtml = productData
      .map((el) => replaceTemplate(templateCard, el))
      .join('');
    const output = templateOverview.replace(/{%PRODUCT_CARDS%}/, cardHtml);
    resp.end(output);
  } else if (pathname === '/product') {
    // Product
    resp.writeHead(200, {
      'Contest-Type': 'text/html',
    });
    const product = productData[query.id];
    const output = replaceTemplate(templateProduct, product);
    resp.end(output);
  } else if (pathname === '/about') {
    // About
    resp.end('This is the ABOUT ME page');
  } else if (pathname === '/api') {
    // Api
    resp.writeHead(200, {
      'Content-Type': 'application/json',
    });
    resp.end(data);
  } else {
    // Fallback case
    resp.writeHead(404, {
      'Content-Type': 'text/html',
      'My-Own-Header': 'Hello from Server',
    });
    resp.end(`<h1>INVALID PAGE </h1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
