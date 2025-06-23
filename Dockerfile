FROM oven/bun AS base

WORKDIR /app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
WORKDIR /deps

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile


FROM base AS prerelease
COPY --from=install /deps/node_modules node_modules
COPY --from=install /deps/.nuxt .nuxt
COPY . .

CMD ["bun", "run", "dev",  "--host", "0.0.0.0", "--port", "3000"]
