#!/usr/bin/env bash

if [[ $EUID -ne 0 ]]; then
   echo "[ERROR] This script must be run as root"
   exit 1
fi

apt install sqlite3

base_path="/opt/ts3viewer2"

touch $base_path/VERSION
touch $base_path/CURRENT_VERSION

cd $base_path/api
sqlite3 ts3viewer2.db ".databases .quit"
