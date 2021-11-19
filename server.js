const http = require('http');
const fs = require('fs');
require('dotenv').config();

const utils = require('./utils');

const port = process.env.APP_PORT;
const host = process.env.APP_LOCALHOST;

const baseUrl = `http://${host}:${port}`;

const json = JSON.parse(fs.readFileSync('./data/students.json'));

http
  .createServer((req, res) => {
    const url = req.url.replace('/', '');

    if (url === 'favicon.ico') {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      res.end();
      return;
    }

    if (url === 'bootstrap') {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      const css = fs.readFileSync('./assets/css/style.css');
      res.write(css);
      res.end();
      return;
    }

    if (url === '') {
      const home = fs.readFileSync('./view/home.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(home);
      res.end();
    }

    if (url === 'users') {
      const content = json.students.map((std, i) => {
        return `<li class="mb-3">Etudiant ${i + 1} : ${std.name}, ${utils.dayjs(std.birth)}
        <a class="btn btn-danger" href=${baseUrl}/delete/${std.id}>x</a></li>`;
      });

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Ajoutez un utilisateur</title>
          <link href="/bootstrap" rel="stylesheet" type="text/css" />
      </head>
      <body>
      <p><a href=${baseUrl} class="btn btn-success m-3">Home</a></p>
      <h1>Liste des utilisateurs</h1>
      <ul>
        ${content.join('')}
      </ul>
      </body>
      </html>`);
    }

    if (url.includes('delete')) {
      const id = url.substring(url.indexOf('/') + 1);
      const filteredJson = json.students.filter(std => parseInt(std.id) !== parseInt(id));

      json.students = filteredJson;
      fs.writeFileSync('./data/students.json', JSON.stringify(json));
      res.writeHead(302, { 'Location': baseUrl + '/users' });
      res.end()
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (data) => {
        body += data;
      });

      req.on('end', () => {
        const [name, birth] = body.split('&');
        
        if (name && birth) {
          const student = {
            name: name.substring(name.indexOf('=') + 1),
            birth: birth.substring(birth.indexOf('=') + 1),
            id: Math.floor(Math.random() * (100000 - 100) + 100) 
          };
          json.students.push(student);

          fs.writeFileSync('./data/students.json', JSON.stringify(json));
        }        
      });
    }
  })
  .listen(port);
console.log(`Server running at ${baseUrl}`);
