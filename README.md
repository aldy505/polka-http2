Simple HTTP2 app with Polka for the router and handler and such.

To generate your own PEM SSL certificates:

```sh
openssl genrsa -out ssl/server-key.pem 4096
openssl req -new -key ssl/server-key.pem -out ssl/server-csr.pem
openssl x509 -req -in ssl/server-csr.pem -signkey ssl/server-key.pem -out ssl/server-cert.pem
```

Run it:

```sh
# Development
npm run dev

# Build
npm run build

# Production (build first!)
npm run start
```

Then visit `https://localhost:3000` on your browser.

If you got a warning saying the site is not secure, just bypass the warning. It's secure.
