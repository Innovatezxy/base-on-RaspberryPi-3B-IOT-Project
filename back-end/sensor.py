import RPi.GPIO as GPIO
import time


try:
    while True:

        mq2 = 40
        beep = 38
        relay = 36
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(mq2, GPIO.IN)
        GPIO.setup(beep, GPIO.OUT)
        GPIO.output(beep, 0)
        GPIO.setup(relay, GPIO.OUT)

        if GPIO.input(mq2) == 1:
            GPIO.output(beep, 0)
        else:
            GPIO.output(relay, 1)
            GPIO.output(beep, 1)
            time.sleep(0.19)
            GPIO.output(beep, 0)
        time.sleep(0.01)
except KeyboardInterrupt:
    pass
GPIO.cleanup()
