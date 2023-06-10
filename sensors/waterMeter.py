import random


class WaterMeter:
    def __init__(self):
        self.reading = 834822

    def get_reading(self):
        self.reading += random.uniform(-100, 100)
        return round(self.reading)