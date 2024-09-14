cd client
sudo apt install python3.10-venv
sudo apt-get install direnv
python3 -m venv .virtualenv

## LPR
```bash
apt update && apt install libegl1 -y
apt-get install ffmpeg libsm6 libxext6  -y
`pip install -r requirements-orange.txt`
```

## PLC
```bash
pip install pymodbus
```

## Orquestator
```bash
pip install pydantic_settings strenum
```

## RFID
sudo apt-get install python3-dev
pip install spidev
