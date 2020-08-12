import time
import tornado.ioloop
import tornado.web
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
import json
import RPi.GPIO as GPIO
import subprocess


class InfoHandler(tornado.web.RequestHandler):
    async def get(self):

        # 定义GPIO引脚及其工作模式
        mq2 = 40
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(mq2, GPIO.IN)

        #  创建字典及数组
        list = {}
        result = []
        try:
            # 获取18B20温度传感器
            cmd = "cd /sys/bus/w1/devices/28-800000208f22 && cat w1_slave | awk 'NR==2{printf \"%s\", $10 }'"
            Evtmp = subprocess.check_output(cmd, shell=True)
            evtmp = str(round(int(str(Evtmp, encoding='utf-8').replace("t=", "")) / 1000, 2) - 1)
            list['evtmp'] = evtmp

            # 获取MQ-2可燃气体传感器数据
            if GPIO.input(mq2) == 1:
                list['smog'] = 'working'
            else:
                list['smog'] = 'danger'
        except KeyboardInterrupt:
            pass
        # 关闭GPIO引脚监听，避免资源浪费
        GPIO.cleanup()

        # 将字典存入数组并转换成JSON类型
        result.append(list)
        results = json.loads(json.dumps(result, ensure_ascii=False))

        # 将数据写入到响应中
        self.write({
            'success': True,
            'result': results
        })


class RelayInfoHandler(tornado.web.RequestHandler):
    async def get(self):

        # 定义GPIO引脚及其工作模式
        relay = 36
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(relay, GPIO.IN)

        #  创建字典及数组
        list = {}
        result = []
        try:
            # 获取继电器当前状态
            if GPIO.input(relay) == 1:
                list['relay'] = 'on'
            else:
                list['relay'] = 'off'
        except KeyboardInterrupt:
            pass
        # 关闭GPIO引脚监听，避免资源浪费
        GPIO.cleanup()

        # 将字典存入数组并转换成JSON类型
        result.append(list)
        results = json.loads(json.dumps(result, ensure_ascii=False))

        # 将数据写入到响应中
        self.write({
            'success': True,
            'result': results
        })


class ControlHandler(tornado.web.RequestHandler):
    async def get(self):

        relay_switch = self.get_argument("relay")

        # 定义GPIO引脚及其工作模式
        relay = 36
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(relay, GPIO.OUT)


        if relay_switch == 'on':
            GPIO.output(relay, 1)
        else:
            GPIO.output(relay, 0)

        # 关闭GPIO引脚监听，避免资源浪费
        GPIO.cleanup()

        # 将数据写入到响应中
        self.write({
        'success': True,
        })


def make_app():
    return tornado.web.Application([
        (r"/info", InfoHandler),
        (r"/relayinfo", RelayInfoHandler),
        (r"/control", ControlHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
