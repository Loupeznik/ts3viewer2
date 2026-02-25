# TS3Viewer2

TS3Viewer2 provides a REST API an a web interface mainly for interacting with self-hosted [TeamSpeak3](https://www.teamspeak.com/en/) servers. Additionally it is able to control an instance of [TS3AudioBot](https://github.com/Splamy/TS3AudioBot). In the future it will also be expanded to offer the ability to fully administer one or multiple servers.

The project is still under development.

## Development

Prerequisities for local development:

- .NET 10 SDK
- Node.js 24+
- TeamSpeak3 Server (local installation or Docker)
- TS3AudioBot (optional)

This project uses and depends on forked version of [TS3QueryApi](https://github.com/nikeee/TeamSpeak3QueryApi) which can be found [here](https://github.com/Loupeznik/TeamSpeak3QueryApi) which was updated to better support concurrent operations on the TeamSpeak3 server query.

The fork is available as a nuget from my NuGet feed at `nuget.dzarsky.eu`. To add the feed to sources, run:

```powershell
dotnet nuget add source https://nuget.dzarsky.eu/v3/index.json --name nuget.dzarsky.eu
```

### Quick Start with Docker Compose

The easiest way to run the full stack locally:

```bash
docker compose up
```

This starts three services:
- **TeamSpeak server** — ports 9987/udp, 10011, 30033
- **API** — port 20800 (mapped to container port 8080)
- **Web frontend** — port 20801 (mapped to container port 80)

The `docker-compose.yml` uses environment variable substitution for secrets. Copy the `.env.example` file to `.env` and fill in the values before running. On first run, the API will automatically run EF Core migrations (controlled by `RUN_MIGRATIONS=true`) which creates a default `react-app` user with a random secret.

To retrieve the react-app secret after first run:

```bash
docker compose exec api cat /app/data/ts3viewer2.db | strings | grep -A0 'react-app'
# Or copy the database and query it directly:
docker compose cp api:/app/data/ts3viewer2.db /tmp/ts3viewer2.db
sqlite3 /tmp/ts3viewer2.db "SELECT Secret FROM Users WHERE Login='react-app';"
```

Update `src/DZarsky.TS3Viewer2.Web/.env.development` with the retrieved secret in `VITE_APP_SECRET`.

#### Generating RSA JWK for JWT Signing

The API uses RS256 (RSA) for JWT signing. The `Security__Jwt__Key` environment variable must contain a base64-encoded RSA JSON Web Key. To generate one:

```python
# pip install cryptography
import json, base64
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

key = rsa.generate_private_key(public_exponent=65537, key_size=2048, backend=default_backend())

def int_to_base64url(n):
    b = n.to_bytes((n.bit_length() + 7) // 8, 'big')
    return base64.urlsafe_b64encode(b).rstrip(b'=').decode()

priv = key.private_numbers()
pub = priv.public_numbers

jwk = {
    "kty": "RSA",
    "n": int_to_base64url(pub.n),
    "e": int_to_base64url(pub.e),
    "d": int_to_base64url(priv.d),
    "p": int_to_base64url(priv.p),
    "q": int_to_base64url(priv.q),
    "dp": int_to_base64url(priv.dmp1),
    "dq": int_to_base64url(priv.dmq1),
    "qi": int_to_base64url(priv.iqmp),
    "alg": "RS256",
    "use": "sig"
}

print(base64.b64encode(json.dumps(jwk).encode()).decode())
```

The output is the value to use for `Security__Jwt__Key` in `docker-compose.yml`.

#### Query IP Allowlist

The `query_ip_allowlist.txt` file at the repo root is mounted into the TeamSpeak container to allow server query connections from Docker network IPs. The default content (`0.0.0.0/0`) allows all IPs, which is suitable for local development.

### Running TeamSpeak3 Server (Without Docker Compose)

For development without Docker Compose, an instance of TeamSpeak3 server is required. The easiest way to run TeamSpeak3 server locally is via Docker:

```bash
docker run -d -p 9987:9987/udp -p 10011:10011 -p 30033:30033 -e TS3SERVER_LICENSE=accept teamspeak
```

Otherwise it is possible to install the server on your system directly by downloading it from the [official downloads page](https://www.teamspeak.com/en/downloads/#server).

Note that for the API to work optimally with the server, your internal IP needs to be listed in the `query_ip_allowlist.txt` file in the server install directory.

The records should be:

```text
127.0.0.1
::1
172.17.0.1
```

The last record is for your docker host IP.

After running the TeamSpeak3 Server for the first time, copy the global server query credentials and fill these into appsettings/secrets.

### Running TS3AudioBot

Optionally, clone and run TS3AudioBot [TS3AudioBot](https://github.com/Splamy/TS3AudioBot) to use the TS3AudioBot integration.

After configuring the Bot, message `!token` to the bot - this will generate a token which will then need to be filled in AudioBot section of the `appsettings.json` file.

## Hosting

Server requirements:

- A web server with reverse proxy support (NGINX, Apache2/httpd, ...)
- .NET 10 Runtime (see [.NET documentation](https://learn.microsoft.com/en-us/dotnet/core/install/))
- TeamSpeak3 server (see *Running TeamSpeak3 Server* section above)
- TS3AudioBot and its dependencies (optional - see [documentation](https://github.com/Splamy/TS3AudioBot))

Steps:

1. Install and configure TeamSpeak3 server on the target server
2. Build the API in release configuration
3. Build the React app
4. Copy the artifacts to the target server (or use CI/CD to deploy automatically)
5. Copy the files to their own directories (e.g. `/opt/ts3viewer2/web` and `/opt/ts3viewer2/api`)
6. Create a service for the API to run in the background
7. Update appsettings with configuration of your server (e.g. serverquery credentials, path to AudioBot files, etc.)
8. Setup the web server for the React app and API (see *Example NGINX configuration*)
9. Start the service (see *Example service configuration*)

### Example NGINX configuration (Linux)

API

```text
# /etc/nginx/sites-available/ts3viewer2-api
server {
        server_name api.ts3viewer.yourdomain.com;

        location / {
                proxy_pass http://127.0.0.1:5000;
        }

        listen 80;
        listen [::]:80;
}
```

WEB (includes PWA configuration)

```text
# /etc/nginx/sites-available/ts3viewer2-web
server {
        include mime.types;

        root /opt/ts3viewer2/web;
        index index.html index.htm;

        server_name web.ts3viewer.yourdomain.com;

        types {
                application/manifest+json  webmanifest;
        }

        location / {
                autoindex off;
                expires off;
                add_header Cache-Control "public, max-age=0, s-maxage=0, must-revalidate" always;
                try_files $uri /index.html;
        }

        location ^~ /assets/ {
                add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
                try_files $uri =404;
        }

        location ^~ /workbox- {
                add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
                try_files $uri =404;
        }

        listen 80;
        listen [::]:80;
}
```

Run

```bash
ln -s /etc/nginx/sites-available/ts3viewer2-api /etc/nginx/sites-enabled/ts3viewer2-api
ln -s /etc/nginx/sites-available/ts3viewer2-web /etc/nginx/sites-enabled/ts3viewer2-web
```

Depending on how you use the API, you might not want to expose it to the internet. In that case, do not enable the API site configuration.

### Example service configuration

```text
[Unit]
Description=TS3Viewer2 API
[Service]
WorkingDirectory=/opt/ts3viewer2/api
ExecStart=/usr/bin/dotnet /opt/ts3viewer2/api/DZarsky.TS3Viewer2.Api.dll
Restart=always
RestartSec=10
SyslogIdentifier=ts3viewer2-api
User=teamspeak
Environment=ASPNETCORE_ENVIRONMENT=Production
[Install]
WantedBy=multi-user.target
```

Run `sudo service ts3viewer2 start`
