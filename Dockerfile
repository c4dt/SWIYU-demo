FROM oven/bun AS base

WORKDIR /app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile


FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/.nuxt .nuxt
COPY . .

CMD ["bun", "run", "dev",  "--host", "0.0.0.0", "--port", "3000"]
