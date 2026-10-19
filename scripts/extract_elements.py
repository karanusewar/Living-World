import os
import subprocess
import math

# Ensure PPM source exists
subprocess.run(['convert', 'public/images/my_world.jpg', 'public/images/source.ppm'], check=True)

with open('public/images/source.ppm', 'rb') as f:
    header = []
    while len(header) < 3:
        line = f.readline().decode('ascii').strip()
        if line and not line.startswith('#'):
            header.extend(line.split())
    W = int(header[1])
    H = int(header[2])
    data = bytearray(f.read())

def get_pixel(x, y):
    if x < 0: x = 0
    if x >= W: x = W - 1
    if y < 0: y = 0
    if y >= H: y = H - 1
    idx = (y * W + x) * 3
    return (data[idx], data[idx+1], data[idx+2])

def set_pixel(x, y, r, g, b):
    if 0 <= x < W and 0 <= y < H:
        idx = (y * W + x) * 3
        data[idx] = max(0, min(255, int(r)))
        data[idx+1] = max(0, min(255, int(g)))
        data[idx+2] = max(0, min(255, int(b)))

# First: Let's remove the birds in region x: 720..950, y: 70..160
# In this region, birds are small dark spots (R < 180, G < 180, B < 210) while sky is bright (R > 215, G > 225, B > 240)
print("Removing birds...")
for y in range(65, 170):
    for x in range(710, 960):
        r, g, b = get_pixel(x, y)
        # Bird pixels are significantly darker or gray compared to the bright sky
        # Check against local sky estimation (linear interpolation between x=700 and x=970)
        t = (x - 700) / 270.0
        p_left = get_pixel(700, y)
        p_right = get_pixel(970, y)
        expected_r = p_left[0] * (1 - t) + p_right[0] * t
        expected_g = p_left[1] * (1 - t) + p_right[1] * t
        expected_b = p_left[2] * (1 - t) + p_right[2] * t
        
        # If pixel is significantly darker than expected sky, it's a bird pixel
        diff = (expected_r - r) + (expected_g - g) + (expected_b - b)
        if diff > 35:
            # Replace with interpolated sky
            set_pixel(x, y, expected_r, expected_g, expected_b)

# Now, save the intermediate to check birds removal
with open('public/images/clean_birds.ppm', 'wb') as f:
    f.write(f"P6\n{W} {H}\n255\n".encode('ascii'))
    f.write(data)

subprocess.run(['convert', 'public/images/clean_birds.ppm', '-crop', '300x150+720+60', 'public/images/birds_removed_check.png'], check=True)
print("Done birds removal test.")
