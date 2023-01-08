#!/usr/bin/env bash

# CREATES A CRON JOB WHICH KEEPS THE SERVER QUERY FROM DISCONNECTING BY SENDING A REQUEST TO FETCH SERVER INFO FROM THE API

cronfile="ts3viewer2-cron"

mkdir -p /tmp/ts3viewer2-install
cd /tmp/ts3viewer2-install

crontab -l > ts3viewer2-cron
echo "1-59 * * * * curl http://127.0.0.1:5000/api/v1/server/info > /dev/null" >> ts3viewer2-cron

crontab ts3viewer2-cron
rm -rf /tmp/ts3viewer2-install
