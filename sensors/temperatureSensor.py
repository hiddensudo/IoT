import random


class TemperatureSensor:
    def __init__(self):
        self.temperature = 20

    def get_temperature(self):
        self.temperature += random.uniform(-0.5, 0.5)
        return round(self.temperature, 1)