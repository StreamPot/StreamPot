# Self-hosting with a Docker Compose

Create a new `compose.yml`:

```yml
services:
  server:
    image: streampot/server:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://postgres:example@db:5432/example
      REDIS_CONNECTION_STRING: redis://redis:6379
      S3_ACCESS_KEY: ${S3_ACCESS_KEY}
      S3_SECRET_KEY: ${S3_SECRET_KEY}
      S3_REGION: ${S3_REGION}
      S3_BUCKET_NAME: ${S3_BUCKET_NAME}
      S3_ENDPOINT: ${S3_ENDPOINT}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
  db:
    image: postgres:16
    restart: always
    user: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=example
      - POSTGRES_PASSWORD=example
    expose:
      - 5432
    healthcheck:
      test: [ "CMD", "pg_isready" ]
      interval: 10s
      timeout: 5s
      retries: 5
  redis:
    image: redislabs/redismod
    ports:
      - '6379:6379'
    healthcheck:
      test: [ "CMD", "redis-cli", "--raw", "incr", "ping" ]
volumes:
  db-data:
```

With the following `.env` file configuration:

```
S3_ACCESS_KEY=accessKey
S3_SECRET_KEY=secretKey
# S3_REGION=eu-west-2
S3_BUCKET_NAME=yourBucket
S3_ENDPOINT=https://random3423424.r2.cloudflarestorage.com
```

And run:

```shell
docker compose up
```

The app should be running at `127.0.0.1:3000`. Congrats!