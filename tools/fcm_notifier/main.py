#!/usr/bin/env python3

import pydotenv
import requests
import json
import time
import schedule

env = pydotenv.Environment(check_file_exists=True)
lastId = 1


def checkClients():
    response = requests.request("GET", env["CLIENTS_ENDPOINT"], verify=False)

    if response.status_code == 200:
        clients = response.json()
        global lastId

        for client in clients:
            if client["id"] > lastId and client["type"] == 0:

                lastId = client["id"]
                notify(client["nickName"])


def notify(name: str):
    payload = json.dumps({
        "to": f"/topics/{env['FCM_TOPIC']}",
        "notification": {
            "title": f"{name} has connected",
            "body": f"Client {name} has connected to the TS3 server"
        }
    })

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {env["FCM_APIKEY"]}'
    }

    response = requests.request(
        "POST", env["FCM_ENDPOINT"], headers=headers, data=payload)

    if response.status_code != 200:
        print('Notification request failed')


schedule.every(1).seconds.do(checkClients)

while True:
    schedule.run_pending()
    time.sleep(1)
