FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun i

COPY . .

EXPOSE 4545

CMD [ "bun", "dev" ]