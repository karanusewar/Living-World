import os
import math
from PIL import Image, ImageFilter

def make_clean_sky():
    img = Image.open('public/images/my_world.jpg').convert('RGB')
    W, H = img.size
    pixels = img.load()
    
    clean_img = img.copy()
    clean_pixels = clean_img.load()
    
    # 1. Inpaint Left Clouds: x from 0 to 415, y from 0 to 142
    for x in range(0, 420):
        c_top = pixels[x, 0]
        c_bot = pixels[x, 145]
        for y in range(0, 145):
            t = y / 145.0
            r = c_top[0] * (1 - t) + c_bot[0] * t
            g = c_top[1] * (1 - t) + c_bot[1] * t
            b = c_top[2] * (1 - t) + c_bot[2] * t
            
            # Feather at x boundary 380..420
            if x > 380:
                fx = (x - 380) / 40.0
                orig = pixels[x, y]
                r = r * (1 - fx) + orig[0] * fx
                g = g * (1 - fx) + orig[1] * fx
                b = b * (1 - fx) + orig[2] * fx
                
            clean_pixels[x, y] = (int(r), int(g), int(b))
            
    # 2. Inpaint Birds: x from 710 to 950, y from 65 to 160
    for x in range(705, 955):
        c_top = pixels[x, 60]
        c_bot = pixels[x, 165]
        for y in range(65, 165):
            t = (y - 60) / 105.0
            r = c_top[0] * (1 - t) + c_bot[0] * t
            g = c_top[1] * (1 - t) + c_bot[1] * t
            b = c_top[2] * (1 - t) + c_bot[2] * t
            
            blend = 1.0
            if x < 725:
                blend = min(blend, (x - 705) / 20.0)
            elif x > 935:
                blend = min(blend, (955 - x) / 20.0)
                
            orig = pixels[x, y]
            r = r * blend + orig[0] * (1 - blend)
            g = g * blend + orig[1] * (1 - blend)
            b = b * blend + orig[2] * (1 - blend)
            clean_pixels[x, y] = (int(r), int(g), int(b))

    # 3. Inpaint Right Clouds: x from 910 to W, y from 0 to 142
    for x in range(910, W):
        c_top = pixels[x, 0]
        c_bot = pixels[x, 145]
        for y in range(0, 145):
            t = y / 145.0
            r = c_top[0] * (1 - t) + c_bot[0] * t
            g = c_top[1] * (1 - t) + c_bot[1] * t
            b = c_top[2] * (1 - t) + c_bot[2] * t
            
            if x < 940:
                fx = (x - 910) / 30.0
                orig = pixels[x, y]
                r = r * fx + orig[0] * (1 - fx)
                g = g * fx + orig[1] * (1 - fx)
                b = b * fx + orig[2] * (1 - fx)
                
            clean_pixels[x, y] = (int(r), int(g), int(b))

    clean_img.save('public/images/my_world_clearsky.jpg', quality=96)
    print("Created public/images/my_world_clearsky.jpg")

    # Now extract the exact clouds using difference against clean sky
    # Cloud 1: Left Big Cloud (x: 25..305, y: 15..120)
    def extract_cloud(x1, y1, x2, y2, out_name):
        w = x2 - x1
        h = y2 - y1
        cloud_rgba = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        c_pixels = cloud_rgba.load()
        for cx in range(w):
            for cy in range(h):
                orig_x = x1 + cx
                orig_y = y1 + cy
                op = pixels[orig_x, orig_y]
                sp = clean_pixels[orig_x, orig_y]
                # Difference in red or total color distance
                # Cloud is much redder/whiter than blue sky
                diff = (op[0] - sp[0]) * 1.5 + (op[1] - sp[1]) * 0.8
                if diff > 15:
                    alpha = min(255, int((diff - 15) * 4.5))
                    c_pixels[cx, cy] = (op[0], op[1], op[2], alpha)
        cloud_rgba.save(out_name)
        print(f"Extracted {out_name} ({w}x{h})")

    extract_cloud(25, 15, 310, 120, 'public/images/cloud_left_main.png')
    extract_cloud(275, 60, 400, 125, 'public/images/cloud_left_small.png')
    extract_cloud(1030, 20, 1370, 135, 'public/images/cloud_right_main.png')
    extract_cloud(920, 65, 1025, 125, 'public/images/cloud_right_small.png')

if __name__ == '__main__':
    make_clean_sky()
