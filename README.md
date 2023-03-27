This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

### Requirements

Install the following:

- Node.JS version - 18.12.1 LTS (would recommend that you install through [nvm](https://github.com/nvm-sh/nvm))
- npm - 8.19.2

Typical workflow

- `git clone https://github.com/usdevs/usc-website-hackathon-frontend.git`
- Navigate to the directory
- `npm i`
- `git checkout dev`
- `git branch -d <branch-name`
- `git add -A`
- `git commit -m <message>`
- If upstream does not exist, `git push --set-upstream origin <branch-name` else `git push origin`
- Create PR on GitHub from `<branch-name>` to `<master>`

## Initial setup

1. `npm install`

### Setting up the backend

Add your Tele handle to the Users sheet in the Excel file, and your organisations you are a member of to the userOnOrg sheet in the file

```bash
$ docker-compose up
$ npm install
$ npm run prisma:migrate
$ npm run prisma:seed
$ # update env files
$ git checkout frontend
```

- Make .env file
- 1. Install pgadmin if you prefer that - https://www.pgadmin.org/download/

2. Telegram login and add yourself as a user to the DB (like via pgadmin)
   https://usdevs.github.io/uscwebsite-hackathon-backend/

## Running it locally

Run the following in separate terminals

1. `npm run dev`
2. `cd <backend repo> && yarn dev`
3. `cd <backend repo> && docker-compose up`

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

### Telegram login token

1. EITHER go to https://usdevs.github.io/uscwebsite-hackathon-backend/, login, copy the token and paste it into `const NEXT_PUBLIC_BACKEND_JWT_DEV =` on line 7 in `components/Auth.tsx`.
2. OR Tried to Dockerise this, view `docker` branch
3. OR Linux set-up to set up nginx as a proxy (should be roughly similar for Mac, not sure about Windows)
3. Install `mkcert` and generate certs for a domain. I am using `frontend.local.dev`. (check `certgen.sh` on the `docker` branch)
3. In your hosts file, add `127.0.0.1 frontend.local.dev`
3. Copy the `nginx.conf` on the docker branch over to `/etc/nginx/conf/default.conf` or somewhere
3. `sudo nginx -t && sudo systemctl restart nginx`
3. If you have `apache` running, need to deconflict it as pgadmin uses it as well. You can change the port it uses, or change nginx's port. Otherwise, you can just `sudo service apache2 stop` and not use pgadmin. 
3. You will have to update the Tele bot's BOT_TOKEN on the backend repo to '5980011686:AAHuxodOvlPYeftZTElSpC-13ybW5to9Y1M' if you used frontend.local.dev, or you can set up your own Tele login bot or let me know if you want to use another domain.

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
