## NextJS

### Prerequisites

Node version 20.x

### Cloning the repository

    git clone https://github.com/anilsoylu/melezinho.git

### Install packages

    npm i

### Setup .env file

    DATABASE_URL=

    ADMIN_USERNAME=
    ADMIN_PASSWORD=

    Running commands with pnpm `pnpm dlx auth secret`
    NEXTAUTH_URL=
    AUTH_SECRET=


    NEXT_PUBLIC_APP_URL=
    NEXT_PUBLIC_API_URL=
    NEXT_PUBLIC_API_SECRET_TOKEN=

### Setup Prisma

    npm run db:seed
    npm run db:generate
    npm run db:migrate
    npm run db:push

### Start the app

    npm run dev

### Available Commands

Running commands with npm: `npm run [command]`

| Command       | Description                                   |
| ------------- | --------------------------------------------- |
| `dev`         | Starts a development instance of the app      |
| `build`       | Builds the app for production                 |
| `start`       | Starts the production build of the app        |
| `lint`        | Runs linting to check for code quality issues |
| `db:seed`     | Seeds the database with initial data          |
| `db:generate` | Generates Prisma client based on the schema   |
| `db:migrate`  | Applies new migrations to the database        |
| `db:push`     | Pushes the schema changes to the database     |
| `postinstall` | Runs Prisma client generation after install   |
