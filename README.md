This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

### Requirements

Install the following:

- Node.JS version - 18.12.1 LTS (would recommend that you install through [nvm](https://github.com/nvm-sh/nvm))
- npm - 8.19.2

## Links

[Backend production deployment](api.nusc.club)

[Frontend production deployment](nusc.club)

[Backend production deployment](https://dev.nusc.club/)

[UI Mockup](https://www.figma.com/file/ugpNsd5OkAfdPHJQYStQbA/NUSC-website?node-id=0%3A1&t=yy9jhvx6KWpgYHxF-0)

## Setup and initial install

1. Clone this repo.
2. `cd usc-website-hackathon-frontend`
3. `npm install`
4. Copy the .env file from an existing person.
5. `npm run dev`
6. Go to http://localhost:3001/admin --> the 'Users' tab --> add yourself as a new user.

At this stage, if you do not want the hassle of setting up the backend locally or you only intend to focuse on the UI, you can use the shared development backend at https://dev.nusc.club/ for dev purposes. Note that https://dev.nusc.club/ points to https://167.71.198.73/ (a DigitalOcean droplet).

To use shared development backend, you do not need to do anything. The .env file's `NEXT_PUBLIC_BACKEND_URL` by default points to https://dev.nusc.club/.

You should run the backend locally if you do not want your changes to the database to be reflected to others.

#### Steps to setup the backend locally

1. Clone the backend repo
2. Set it up (instructions below). 
3. Point the frontend .env file's `NEXT_PUBLIC_BACKEND_URL` to the appropriate localhost URL.
4. `cd <backend repo> && npm run dev`
5. `cd <backend repo> && docker-compose up`

## Development Process


### Linters

Do run the linters before pushing to the remote:

```
npm run linter-prettier
npm run linter-eslint
npm run linter-next
```

### Telegram login token

If you are working on the certain components such as the bookings or the admin pages, you may need to login to test your changes.

#### First method

1. Go to admin page at https://nusc.club/admin, login to Telegram.
2. Go to the 'Token' tab.
3. Copy the token and paste it into `NEXT_PUBLIC_BACKEND_JWT_DEV` in the `.env` file. Copy your userId from the "Users" table in the DB to `NEXT_PUBLIC_BACKEND_TELEGRAM_USER_ID` as well.
4. Do add your Telegram ID to the database manually, otherwise you will not be able to make a booking
    - Google on how to get your Telegram ID.
    - Go to the Users table and find the entry containing your name.
    - Add your ID to the `telegramId` field.

#### Second method (Linux and MacOS only)

3. Set-up to set up nginx as a proxy (should be roughly similar for Mac, not sure about Windows)
4. Install `mkcert` from https://github.com/FiloSottile/mkcert and generate certs for a domain. I am using `frontend.local.dev`. (run the commands in `certgen.sh` in the nginx folder)
5. In your hosts file, add `127.0.0.1 frontend.local.dev`
6. Copy the `app.conf` in the `config/To set up Telegram Auth` folder over to `/etc/nginx/conf.d` or to a path that you have included in your `nginx.conf` (see the sample `nginx.conf`'s line 17 to see how you can include the `conf.d` directory on a Mac machine - Linux should have this by default)
7. `sudo nginx -t && sudo systemctl restart nginx` for Linux, `sudo nginx -t && sudo nginx -s stop && sudo nginx` for MacOS
8. If you have `apache` running, need to deconflict it as pgadmin uses it as well. You can change the port it uses, or change nginx's port. Otherwise, you can just `sudo service apache2 stop` and not use pgadmin.
9. You will have to update the Tele bot's BOT_TOKEN on the backend repo to '5980011686:AAHuxodOvlPYeftZTElSpC-13ybW5to9Y1M' if you used frontend.local.dev, or you can set up your own Tele login bot or let me know if you want to use another domain.
10. Change NEXT_PUBLIC_NGINX_PROXY_ON in line 9 in Auth.tsx to true!

#### Third method (incomplete)

The second method should be Docker-ised if possible, view the `Archive` folder in `/config/To set up Telegram Auth`.

## Setting up the backend locally

Add your Tele handle to the Users sheet in the Excel file, and your organisations you are a member of to the userOnOrg sheet in the file. Do add yourself to an admin organisation, such as the Management Committee. Otherwise, you can manually add it yourself (steps below)

#### Set up a connection to the POSTGRESQL server (to be updated, contact @parth-io for details)

1. Install pgadmin (or your own preferrend software - I just use Intellij and the CLI for this) - https://www.pgadmin.org/download/
2. Launch it - the default password is 'admin'
3. Right-click on "Servers" and click on "Register"
4. Ensure that you have launched the docker POSTGRESDB
5. Put the "name" in the "General" tab as "nusc"
6. In the "Connection" tab, "Host name" is "localhost" and "port" is 5433. The password is "1234" (you can leave the username as "postgres")
7. Save it! Note that to save changes to pgadmin, need to use "F6" or click on the tiny save changes button after you add your new rows.
8. Login to the Telegram via [this link](https://usdevs.github.io/uscwebsite-hackathon-backend/) and add yourself as a user to the "Users" table in pgadmin.
9. Add yourself to an IG/organisation in the "UserOnOrg" table

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

1. Add the backend .env file - get it from an existing person using the repo.
