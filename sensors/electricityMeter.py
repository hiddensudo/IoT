import random


class ElectricityMeter:
    def __init__(self):
        self.reading = 1174478

    def get_reading(self):
        self.reading += random.uniform(-100, 100)
        return round(self.reading)