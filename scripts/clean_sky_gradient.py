import os
import subprocess

# Convert original to PPM
subprocess.run(['convert', 'public/images/my_world.jpg', 'public/images/src_orig.ppm'], check=True)

with open('public/images/src_orig.ppm', 'rb') as f:
    header = []
    while len(header) < 3:
        line = f.readline().decode('latin1').strip()
        if line and not line.startswith('#'):
            header.extend(line.split())
    W = int(header[1])
    H = int(header[2])
    data = bytearray(f.read())

def get_rgb(x, y):
    x = max(0, min(W - 1, x))
    y = max(0, min(H - 1, y))
    idx = (y * W + x) * 3
    return (data[idx], data[idx+1], data[idx+2])

def set_rgb(x, y, r, g, b):
    if 0 <= x < W and 0 <= y < H:
        idx = (y * W + x) * 3
        data[idx] = max(0, min(255, int(r)))
        data[idx+1] = max(0, min(255, int(g)))
        data[idx+2] = max(0, min(255, int(b)))

# Cloud regions to clear:
# 1. Left clouds: x: 0 to 410, y: 0 to 140
# 2. Birds: x: 710 to 950, y: 65 to 160
# 3. Right clouds: x: 910 to 1375, y: 0 to 150

# For Left clouds: y_top = 0, y_bot = 145
for x in range(0, 420):
    c_top = get_rgb(x, 0)
    c_bot = get_rgb(x, 145)
    for y in range(0, 145):
        t = y / 145.0
        # Smooth interpolation
        r = c_top[0] * (1 - t) + c_bot[0] * t
        g = c_top[1] * (1 - t) + c_bot[1] * t
        b = c_top[2] * (1 - t) + c_bot[2] * t
        
        # Feather smoothly at x boundary 380..420
        if x > 380:
            fx = (x - 380) / 40.0
            orig = get_rgb(x, y)
            r = r * (1 - fx) + orig[0] * fx
            g = g * (1 - fx) + orig[1] * fx
            b = b * (1 - fx) + orig[2] * fx
            
        set_rgb(x, y, r, g, b)

# For Birds: x: 710 to 950, y: 70 to 155
for x in range(710, 950):
    c_top = get_rgb(x, 60)
    c_bot = get_rgb(x, 160)
    for y in range(65, 160):
        t = (y - 60) / 100.0
        r = c_top[0] * (1 - t) + c_bot[0] * t
        g = c_top[1] * (1 - t) + c_bot[1] * t
        b = c_top[2] * (1 - t) + c_bot[2] * t
        
        # Feather horizontally at boundaries
        blend = 1.0
        if x < 730:
            blend = min(blend, (x - 710) / 20.0)
        elif x > 930:
            blend = min(blend, (950 - x) / 20.0)
            
        if blend < 1.0:
            orig = get_rgb(x, y)
            r = r * blend + orig[0] * (1 - blend)
            g = g * blend + orig[1] * (1 - blend)
            b = b * blend + orig[2] * (1 - blend)
            
        set_rgb(x, y, r, g, b)

# For Right clouds: x: 910 to 1375, y: 0 to 145
for x in range(910, W):
    c_top = get_rgb(x, 0)
    c_bot = get_rgb(x, 145)
    for y in range(0, 145):
        t = y / 145.0
        r = c_top[0] * (1 - t) + c_bot[0] * t
        g = c_top[1] * (1 - t) + c_bot[1] * t
        b = c_top[2] * (1 - t) + c_bot[2] * t
        
        # Feather at x boundary 910..940
        if x < 940:
            fx = (x - 910) / 30.0
            orig = get_rgb(x, y)
            r = r * fx + orig[0] * (1 - fx)
            g = g * fx + orig[1] * (1 - fx)
            b = b * fx + orig[2] * (1 - fx)
            
        set_rgb(x, y, r, g, b)

with open('public/images/my_world_clearsky.ppm', 'wb') as f:
    f.write(f"P6\n{W} {H}\n255\n".encode('ascii'))
    f.write(data)

# Convert to high-quality JPEG
subprocess.run(['convert', 'public/images/my_world_clearsky.ppm', '-quality', '96', 'public/images/my_world_clearsky.jpg'], check=True)
print("Saved my_world_clearsky.jpg successfully!")
