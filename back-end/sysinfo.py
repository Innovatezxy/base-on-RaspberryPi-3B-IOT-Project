import time

import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

import subprocess

RST = 17
DC = 27

SPI_PORT = 0
SPI_DEVICE = 0

# 128x64 display with hardware SPI:
disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST, dc=DC, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE, max_speed_hz=8000000))

# Initialize library.
disp.begin()

# Clear display.
disp.clear()
disp.display()

# Create blank image for drawing.
# Make sure to create image with mode '1' for 1-bit color.
width = disp.width
height = disp.height
image = Image.new('1', (width, height))

# Get drawing object to draw on image.
draw = ImageDraw.Draw(image)

# Draw a black filled box to clear the image.
draw.rectangle((0, 0, width, height), outline=0, fill=0)

# Draw some shapes.
# First define some constants to allow easy resizing of shapes.
padding = 2
shape_width = 20
top = padding
bottom = height - padding
# Move left to right keeping track of the current x position for drawing shapes.
x = padding

# Load default font.
font = ImageFont.load_default()

# Alternatively load a TTF font.
# Some other nice fonts to try: http://www.dafont.com/bitmap.php
# font = ImageFont.truetype('Minecraftia.ttf', 8)

while True:
    # Draw a black filled box to clear the image.
    draw.rectangle((0, 0, width, height), outline=0, fill=0)

    # Draw a rectangle.
    draw.rectangle((x, top, width - x, top + 13), outline=255, fill=0)

    cmd = "top -d 0.5 -b -n2 | grep 'Cpu(s)'|tail -n 1 | awk '{printf $2 + $4 + 2.4}'"
    CPU = subprocess.check_output(cmd, shell=True)
    cmd = "vcgencmd measure_temp"
    Tmp = subprocess.check_output(cmd, shell=True)
    cmd = "free -m | awk 'NR==2{printf \"%.1f%%\", ($3+13)*100/$2 }'"
    MemUsage = subprocess.check_output(cmd, shell=True)
    cmd = "hostname -I | cut -d\' \' -f1"
    IP = subprocess.check_output(cmd, shell=True)
    cmd = "date"
    DATE = subprocess.check_output(cmd, shell=True)
    cmd = "cd /sys/bus/w1/devices/28-800000208f22 && cat w1_slave | awk 'NR==2{printf \"%s\", $10 }'"
    Evtmp = subprocess.check_output(cmd, shell=True)


    cpuuse = str(CPU, encoding='utf-8')
    cputmp = (str(Tmp, encoding='utf-8')).replace("temp=", "").replace("'C", "")
    ramuse = str(MemUsage, encoding='utf-8')
    ipadr = str(IP, encoding='utf-8')
    Date = str(DATE, encoding='utf-8')
    evtmp = str(round(int(str(Evtmp, encoding='utf-8').replace("t=", ""))/1000,2)-1)

    draw.text((x + 33 , top + 1), "ZXY RaspPi", font=font, fill=255)
    draw.text((x + 5, top + 17), "CPU:" + cpuuse + "%", font=font, fill=255)
    draw.text((x + 63, top + 17), "RAM:" + ramuse, font=font, fill=255)
    draw.text((x + 5, top + 27), "CT:" + cputmp, font=font, fill=255)
    draw.text((x + 63, top + 27), "ET:" + evtmp, font=font, fill=255)
    draw.text((x + 5, top + 37), "IP :" + ipadr, font=font, fill=255)
    draw.line((x, top + 50, width, top + 50), fill=255)
    draw.text((x + 6, top + 52), DATE, font=font, fill=255)

    # Display image.
    disp.image(image)
    disp.display()
    time.sleep(.1)
