# yieldsage-backend

## create project

`mkdir <project-name>`

## project initialization

`npm init --y`

## check ts version

`tsc -v`

## ts installation if not exists

`npm install -g typescript`

## ts initialization

`tsc --init`

## change tsconfig.json

```
target: "ES6",
allowJs: true,
outDir: "./build"
```

## module instalation

`npm install ts-node typescript nodemon -D`

## module installation

`npm install express dotenv`

## module ts installation

`npm i --save-dev @types/express`

## sequlize and mysql2 installation

`npm install --save sequelize mysql2`

## sequelize-cli installation

`npm install --save-dev sequelize-cli`

## create config .sequelizerc

```
const path = require('path');

module.exports = {
  'config': path.resolve('src/config', 'database.js'),
  'models-path': path.resolve('src/db', 'models'),
  'seeders-path': path.resolve('src/db', 'seeders'),
  'migrations-path': path.resolve('src/db', 'migrations')
};

```

## sequelize init

`npm sequelize-cli init`

## migration

```
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

```

## running migration

```
npx sequelize-cli db:migrate

```

## seeder

```
npx sequelize-cli seed:generate --name UserSeeder
```

## running seeder

```
npx sequelize-cli db:seed all
```

### enable gclud build api

```
gcloud services enable cloudbuild.googleapis.com
```

### create file cloudbuild.yaml and run this command

```
gcloud builds submit --config cloudbuild.yaml .
```
