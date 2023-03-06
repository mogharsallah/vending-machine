# Vending machine

This repo contains my implementation of a code challenge requested by a client.
The gist is implementing a vending machine api and frontend where a user can sign in as a "buyer" or a "seller".

A _Seller_ can create and manage their products

A _Buyer_ can purchase products given a deposit in coins.

A user can logout from all sessions

Try out the demo on: [https://vending-machine-lyart.vercel.app/](https://vending-machine-lyart.vercel.app/)

## Technical choices:

- Language: Javascript with Typescript (criteria)
- Server: [Next.js](https://nextjs.org/) for it's simplicity in creating web apps and ease of deployment via Vercel
- Frontend: [React](https://reactjs.org/) (criteria), [Tailwindcss](https://tailwindcss.com/) for rich css customization and class based integration
- Database: mysql with [Prisma](https://www.prisma.io/) client provides a simple schema generation and migration with Typescript support
- Authentication: Session based using [iron-session](https://github.com/vvo/iron-session), provides a simple yet secure authentication and authorization and invalidation. It also allows a seamless approach for authenticating API and web applications.
- Logging: [winston](https://github.com/winstonjs/winston)
- Test: [jest](https://jestjs.io/)
- Images: product images generated via the [Midjourney AI](https://www.midjourney.com/). For now only 18 images were added. Find the images under: [public/product-images](./public/product-images/)

## Getting Started

First, create a `.env` file with the following variables:

```sh
DATABASE_URL='<mysql-db-url>?sslaccept=strict'
SESSION_SECRET='<32-character-secret>'
SALT_ROUNDS=10
NEXT_PUBLIC_SESSION_NAME='<session-name>' # Example: 'vending-machine-session'
NEXT_PUBLIC_LOGGIN_IN_COOCKIE_NAME='<coockie-name>' # Example: 'logged-id'

```

Install dependencies:

```bash
npm ci
```

Create the database schema:

```bash
npx prisma db push
```

For more details about using Prisma, visit: [Prisma documentation](https://www.prisma.io/docs)

Start the server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Check the [API section](#api) for more details about accessing the api

## Testing

The test setup is separated in-between api and frontend. Each environment runs in separate.
Currently, only some api tests have been added. Adding Frontend tests require creating a dedicated jest config file. Check the [jest.api.config.ts](./jest.api.config.ts)

Api tests target a testing database running on a docker. The automation of the database is configured via [Makefile](./Makefile). After the test finishes, the database and docker container gets removed.

To run api tests, install [docker](https://www.docker.com/)

Run the api tests:

```bash
npm run test:api
```

To run api tests in watch mode, run:

```bash
npm run test:api:watch
```

Test logs are printed to a file named `test_logs.txt` in the root project directory

## API

Visit the open api spec file under [docs/openspec-api.json](./docs/openspec-api.json) for a detailed description.

Test the API endpoints locally on: [http://localhost:3000/api-doc](http://localhost:3000/api-doc)
Or test them on the dome website: [https://vending-machine-lyart.vercel.app/api-doc](https://vending-machine-lyart.vercel.app/api-doc)

## Disclaimer:

The server exposes an [endpoint](./pages/api/purge.ts) that purges the database.

## TODO:

- Handle client side api calls errors. Currently only main flow errors are handled
- Improve tracing and logging
