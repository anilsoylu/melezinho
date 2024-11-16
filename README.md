## NextJS

### Prerequisites

Node version 20.x

### Cloning the repository

    git clone https://github.com/anilsoylu/anilsoylu-new.git

### Install packages

    npm i

### Setup .env file

    DATABASE_URL=

    ADMIN_USERNAME=
    ADMIN_PASSWORD=

    Running commands with pnpm `pnpm dlx auth secret`
    NEXTAUTH_URL=
    AUTH_SECRET=
    NEXT_PUBLIC_RESEND_API_KEY=


    NEXT_PUBLIC_APP_URL=
    NEXT_PUBLIC_IMG_URL=
    NEXT_PUBLIC_API_URL=
    NEXT_PUBLIC_MAIL_ADDRESS=
    NEXT_PUBLIC_APP_NAME=
    NEXT_PUBLIC_APP_DESCRIPTION=
    NEXT_PUBLIC_API_SECRET_TOKEN=
    NEXT_PUBLIC_PANEL_USER_ID=

### Setup Prisma

    npm run db:seed
    npm run db:generate
    npm run db:migrate
    npm run db:push

### Start the app

    npm run dev

### Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| ------- | ---------------------------------------- |
| `dev`   | Starts a development instance of the app |
|         |
