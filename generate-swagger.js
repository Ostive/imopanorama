const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');

const apiPaths = path.join(process.cwd(), 'app', 'api', '**', '*.ts').replace(/\\/g, '/');
const docsPaths = path.join(process.cwd(), 'lib', 'swagger-docs', '**', '*.ts').replace(/\\/g, '/');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'ImoPanorama API', version: '1.0.0' },
  },
  apis: [apiPaths, docsPaths],
};

const spec = swaggerJsdoc(options);
fs.writeFileSync(path.join(process.cwd(), 'public', 'swagger.json'), JSON.stringify(spec, null, 2));
console.log('Swagger generated');
