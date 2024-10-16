rm -r .angular/cache
npm run build:production_wecare
rsync -zvah -og --chown=yoda:www-data --perms --chmod=og+rx --delete dist/wecare/public/ r2d2@195.231.72.75:/var/www/wecare/public
