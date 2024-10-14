<p align="center">
  <img src="https://teddydigital.io/wp-content/uploads/2023/10/logo-branco.png" width="120" alt="Nest Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A node js application to shorten links</p>


## Requirements

- Docker
- Node js 20.0

## Project setup

### With docker compose

```bash
#run 
docker compose -f "docker-composer.yml" up -d --build
```
After running the command, the api will be available on port 3000

### With Node js

```bash
#install dependencies, remember to use a node version of 20.0 or greater
npm install

#(optional) Create only the redis and db services on docker, you can config your local redis and postgres if you don't want to use docker
docker compose  -f "docker-composer.yml" up -d --build db redis

#Run the project
npm run start:dev
```
After this the api will be running on port 3000

## Run tests

```bash
npm run test
```

## Future improvements

- Develop a more robust cache system, which only takes the most popular links, to save cache resources, currently our system clears the cache every day.

- Develop cron to delete urls that are no longer updated or accessed for a long time, freeing up urls for other users.

- Integrate the key generation system for short urls with a more robust tool such as zookeeper, currently using the database's auto increment.


## Stay in touch

- Author - [Glauber Cruz](https://www.linkedin.com/in/glauber-bispo-963845218/)
