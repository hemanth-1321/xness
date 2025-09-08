FROM node:alpine

WORKDIR /app

COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY ./turbo.json .
COPY ./packages ./packages
COPY ./apps/web ./apps/web

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "dev"]
