This is an API for iCamera-1000 cameras.  It handles notifications and motion detection posts.

(It's a hobby project that my son and I wrote, and runs on a raspberry.)

### Development

Use the docker file to get a database and bash env.

```
docker-compose up -d
docker-compose exec dev bash
```

Then install the dependencies, run the migrations and the app.

```
npm install
npm run migrate:up
npm run start:dev
```
