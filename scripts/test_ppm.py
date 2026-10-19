import os
import subprocess

# Convert my_world.jpg to PPM
subprocess.run(['convert', 'public/images/my_world.jpg', 'public/images/source.ppm'], check=True)

with open('public/images/source.ppm', 'rb') as f:
    header = []
    while len(header) < 3:
        line = f.readline().decode('ascii').strip()
        if line and not line.startswith('#'):
            header.extend(line.split())
    width = int(header[1])
    height = int(header[2])
    data = bytearray(f.read())

print(f"Loaded image: {width}x{height}, {len(data)} bytes")
