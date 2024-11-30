# TS3Viewer2

TS3Viewer2 provides a REST API an a web interface mainly for interacting with self-hosted [TeamSpeak3](https://www.teamspeak.com/en/) servers. Additionally it is able to control an instance of [TS3AudioBot](https://github.com/Splamy/TS3AudioBot). In the future it will also be expanded to offer the ability to fully administer one or multiple servers.

The project is still under development.

## Development

Prerequisities for local development:

- Visual Studio 2022+ (with .NET7 installed)
- NodeJS/NPM
- TeamSpeak3 Server (local installation or Docker)
- TS3AudioBot (optional)

This project uses and depends on forked version of [TS3QueryApi](https://github.com/nikeee/TeamSpeak3QueryApi) which can be found [here](https://github.com/Loupeznik/TeamSpeak3QueryApi) which was updated to better support concurrent operations on the TeamSpeak3 server query.

The fork is available as a nuget from my NuGet feed at `nuget.dzarsky.eu`. To add the feed to sources, run:

```powershell
dotnet nuget add source https://nuget.dzarsky.eu/v3/index.json --name nuget.dzarsky.eu
```

### Running TeamSpeak3 Server

For development, an instance of TeamSpeak3 server is required. The easiest way to run TeamSpeak3 server locally is via Docker:

```powershell
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
- .NET7 Runtime (see [.NET documentation](https://learn.microsoft.com/en-us/dotnet/core/install/))
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
