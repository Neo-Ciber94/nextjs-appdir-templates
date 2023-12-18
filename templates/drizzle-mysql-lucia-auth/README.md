# NextJS - Drizzle + Mysql + Lucia-Auth

An NextJS (app-dir) example using [Drizzle](https://orm.drizzle.team/) + [MySQL](https://hub.docker.com/_/mysql) and [Lucia-Auth](https://lucia-auth.com/).

## Usage

Download this template with:

```bash
 degit Neo-Ciber94/nextjs-appdir-templates/templates/drizzle-mysql-lucia-auth
```

Install the packages

```bash
pnpm install
```

You may need to update the packages:

```bash
pnpm upgrade
```

Create a `.env` file using the `.env.sample` and set the environment variables:

```bash
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Then you can migrate or push the changes to the database

```bash
npm run db:migrate
```

or, to push the changes directly to the database

```bash
npm run db:push
```
