#!/usr/bin/env bash

if [[ $EUID -ne 0 ]]; then
   echo "[ERROR] This script must be run as root"
   exit 1
fi

checked=$(cat /opt/ts3viewer2/VERSION)
current=$(cat /opt/ts3viewer2/CURRENT_VERSION)

if [ "$checked" != "$current" ]; then
        echo "$checked" > /opt/ts3viewer2/CURRENT_VERSION

        cd /opt/ts3viewer2/api
        ./efbundle

        service ts3viewer2 restart
fi
