From node:latest as builder
WORKDIR /app
COPY . .
RUN yarn upgrade
Run yarn && yarn build

From node:latest
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/server.js .
Run pwd
COPY ["public", "./public"]
COPY ["package.json", "./"]

Run yarn install --production
CMD ["yarn", "start:server"]
