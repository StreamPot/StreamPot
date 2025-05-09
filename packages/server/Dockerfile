# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine


ARG PNPM_VERSION=9.12.3
# Install pnpm.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@${PNPM_VERSION} --activate

# Install ffmpeg.
RUN apk add --no-cache ffmpeg

WORKDIR /usr/src/app

# Define cache ID as a build argument with default value
ARG CACHE_ID=cache-pnpm-store

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage a bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,id=${CACHE_ID},target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Build the application.
RUN pnpm build

# Remove development dependencies.
RUN pnpm prune --prod

# Run the application as a non-root user.
USER node

# Use production node environment
ENV NODE_ENV production

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
ENTRYPOINT ["./entrypoint.sh"]
