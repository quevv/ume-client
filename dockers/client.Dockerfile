FROM node:16-alpine

ENV NODE_ENV development
ENV NODE_OPTIONS=--max_old_space_size=1024

# https://github.com/vercel/turbo/issues/2198
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# add turborepo
RUN yarn global add turbo

# Set working directory
WORKDIR /app

# Install app dependencies
COPY  ["yarn.lock", "package.json", "./"]

# Copy source files
COPY . .

# Install app dependencies
RUN yarn install

EXPOSE 3000

CMD ["yarn", "build:client"]
