This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

### Requirements

Install the following:

- Node.JS version - 18.12.1 LTS (would recommend that you install through [nvm](https://github.com/nvm-sh/nvm))
- npm - 8.19.2

## Initial setup

1. `npm install`

### Setting up the backend

Add your Tele handle to the Users sheet in the Excel file, and your organisations you are a member of to the userOnOrg sheet in the file. Otherwise, you can manually add it yourself (steps below)

#### Set up the POSTGRESQL server

1. Install pgadmin (or your own preferrend software, or the CLI if you prefer that) - https://www.pgadmin.org/download/
1. Launch it - the default password is 'admin'
2. Right-click on "Servers" and click on "Register"
3. Ensure that you have launched the docker POSTGRE DB
4. Put the "name" in the "General" tab as "nusc"
5. In the "Connection" tab, "Host name" is "localhost" and "port" is 5433. The password is "1234" (you can leave the username as "postgres")
6. Save it! Note that to save changes to pgadmin, need to use "F6" or click on the tiny save changes button after you add your new rows.
7. Login to the Telegram via [this link](https://usdevs.github.io/uscwebsite-hackathon-backend/) and add yourself as a user to the "Users" table in pgadmin.
3. Add yourself to an IG/organisation in the "UserOnOrg" table

#### Set up the repo

```bash
$ docker-compose up
$ npm install
$ npm run prisma:migrate
$ npm run prisma:seed
$ # update env files
$ git checkout frontend
$ npm install
$ npm run prisma:reset
```

#### Final steps

1. Add the .env file - get it from an existing person using the repo.

## Running it locally

Run the following in separate terminals

1. `cd <frontend repo> && npm run dev`
2. `cd <backend repo> && npm run dev`
3. `cd <backend repo> && docker-compose up`

### Telegram login token

1. EITHER go to https://usdevs.github.io/uscwebsite-hackathon-backend/, login, copy the token and paste it into `const NEXT_PUBLIC_BACKEND_JWT_DEV =` on line 8 in `components/Auth.tsx`. Copy your userId from the "Users" table in the DB to NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID on line 7.
2. OR Tried to Dockerise this, view `docker` branch
3. OR Linux set-up to set up nginx as a proxy (should be roughly similar for Mac, not sure about Windows)
4. Install `mkcert` from https://github.com/FiloSottile/mkcert and generate certs for a domain. I am using `frontend.local.dev`. (run the commands in `certgen.sh` in the nginx folder)
5. In your hosts file, add `127.0.0.1 frontend.local.dev`
6. Copy the `app.conf` in the nginx folder over to `/etc/nginx/conf.d` or to a path that you have included in your `nginx.conf` (see the sample `nginx.conf`'s line 17 to see how you can include the `conf.d` directory on a Mac machine - Linux should have this by default)
7. `sudo nginx -t && sudo systemctl restart nginx` for Linux, `sudo nginx -t && sudo nginx -s stop && sudo nginx` for MacOS
8. If you have `apache` running, need to deconflict it as pgadmin uses it as well. You can change the port it uses, or change nginx's port. Otherwise, you can just `sudo service apache2 stop` and not use pgadmin.
9. You will have to update the Tele bot's BOT_TOKEN on the backend repo to '5980011686:AAHuxodOvlPYeftZTElSpC-13ybW5to9Y1M' if you used frontend.local.dev, or you can set up your own Tele login bot or let me know if you want to use another domain.
10. Change NEXT_PUBLIC_NGINX_PROXY_ON in line 9 in Auth.tsx to true!

## YOU CAN FINALLY LAUNCH THE FRONTEND

Open [http://localhost:3001](http://localhost:3001) with your browser to see the frontend.

## Note

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3001/api/hello](http://localhost:3001/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
