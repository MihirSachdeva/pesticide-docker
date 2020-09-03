import socket
import time
import argparse
"""
Check if port is open, avoid docker-compose race condition.
"""

parser = argparse.ArgumentParser(
    description='Check if port is open, avoid docker-compose race condition')
parser.add_argument('--service-name', required=True)
parser.add_argument('--ip', required=True)
parser.add_argument('--port', required=True)

args = parser.parse_args()
service_name = str(args.service_name)
port = int(args.port)
ip = str(args.ip)

while True:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex((ip, port))
    if result == 0:
        print("\033[1mPort {0} is open. Starting Django app...\033[0m".format(service_name))
        break
    else:
        print("\033[1mPort {0} is not open, rechecking...\033[0m".format(service_name))
        time.sleep(3)
