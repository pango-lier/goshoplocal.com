

https://github.com/pango-lier/goshoplocal.com.git

## Installation
# Required
1. Node v16.19.0 , Yarn
2. Docker,Docker-composer (Mysql + Redis)
3. Nginx
4. Pm2

## Backend

# Config Env (copy .env.example to .env)
1. Config Host
2. Config Database (Mysql)
3. Config AdminPassword default (ADMIN_PASSWORD)
4. Config Redis
5. Config Etsy
6. Config Token
7. Config FPT file
8. Config Mail

# Run mysql + redis with Docker
```bash
$ yarn docker:pro build
$ yarn docker:pro up -d
```
# Run pm2
```bash
$ yarn
$ yarn build
$ cd dist
$ pm2 start main
```
# Setup nginx

- Example setup nginx on listingmanager.net file.
+ Setup Https
+ Frontend's SubDomain
+ Server's SubDomain (.../api)

## Frontend
# Config Env (copy .env.example to .env)

```bash
$ yarn
$ yarn build
```

## Create or update UserAdmin+Taxonomies

```bash
$ yarn seed:run
```

## Support


## Stay in touch


## License

Nest is [MIT licensed](LICENSE).

# add SSL
https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04