# FCM notifier

Notifies about newly connected users via Firebase Cloud Messaging. Runs on a schedule.

## Requirements

- Python 3.x
- Firebase
- TS3Viewer2 API instance
- Corrently setup .env file

### Install

```bash
pip3 install -r requirements.txt
```

## Usage

Run the script via `python3 main.py` or run as a service (sample `systemd` service configuration is available in `./infra/notifier.service`).
