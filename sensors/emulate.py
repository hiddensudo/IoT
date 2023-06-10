import configparser
import requests
from datetime import datetime
import time

from gasMeter import GasMeter
from electricityMeter import ElectricityMeter
from waterMeter import WaterMeter
from temperatureSensor import TemperatureSensor

gas_meter = GasMeter()
electricity_meter = ElectricityMeter()
water_meter = WaterMeter()
temperature_sensor = TemperatureSensor()

config = configparser.ConfigParser()
config.read('../config.ini')
user_id = config['DEFAULT']['USER_ID']

gas_count = gas_meter.get_reading()
electricity_count = electricity_meter.get_reading()
water_count = water_meter.get_reading()
temperature_readings = []

current_date = datetime.now().date()

while True:
    new_date = datetime.now().date()
    if new_date != current_date:
        current_date = new_date

        gas_count = gas_meter.get_reading()
        electricity_count = electricity_meter.get_reading()
        water_count = water_meter.get_reading()

        day_temperature = round(sum(temperature_readings) / len(temperature_readings), 2)
        temperature_readings.clear()

        electricity_json = "0" + str(electricity_count)
        water_json = "00" + str(water_count)
        gas_json = "00" + str(gas_count)
        data = {
            'user_id': user_id,
            'gas_count': gas_json,
            'electricity_count': electricity_json,
            'water_count': water_json,
            'day_temperature': day_temperature
        }

        response = requests.post('http://localhost:5000/api/daily/add', json=data)
        print(response.json())

    temperature_readings.append(temperature_sensor.get_temperature())
    day_temperature = round(sum(temperature_readings) / len(temperature_readings), 2)
    print(day_temperature)
    time.sleep(5)
