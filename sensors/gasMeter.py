import random


class GasMeter:
    def __init__(self):
        self.reading = 664820

    def get_reading(self):
        self.reading += random.uniform(-300, 300)
        return round(self.reading)

