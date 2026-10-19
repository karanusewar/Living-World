import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import math

# Load baseline pristine morning image
base_img = Image.open('public/images/my_world.jpg').convert('RGB')
W, H = base_img.size
base_arr = np.array(base_img, dtype=np.float32)

# Save baseline as env_morning.jpg
base_img.save('public/images/env_morning.jpg', quality=95)
print("Saved env_morning.jpg")

# -------------------------------------------------------------
# 1. AFTERNOON (Vibrant Midday Sun, Crisp Azure Sky, Bright Waters)
# -------------------------------------------------------------
# In midday, the sky is deep pure azure blue, sun is overhead, grass is vivid green, water sparkles.
afternoon_arr = base_arr.copy()

# Adjust color balance for high-noon daylight (slightly cooler, vivid saturation, crisp contrast)
# Sky mask: higher up (y < 260) with high blue / low red
y_indices, x_indices = np.indices((H, W))

# Midday sky gradient overlay: deep rich cyan-blue
sky_factor = np.clip((220 - y_indices) / 180.0, 0, 1) ** 1.5

# Boost greens and blues, enhance midday brilliance
afternoon_arr[:, :, 0] = np.clip(afternoon_arr[:, :, 0] * (0.95 - sky_factor * 0.15) + sky_factor * 20, 0, 255)
afternoon_arr[:, :, 1] = np.clip(afternoon_arr[:, :, 1] * (1.04 + sky_factor * 0.05), 0, 255)
afternoon_arr[:, :, 2] = np.clip(afternoon_arr[:, :, 2] * (1.12 + sky_factor * 0.25) + sky_factor * 45, 0, 255)

# Overall brightness & contrast enhancement for high-noon clarity
afternoon_img = Image.fromarray(np.uint8(afternoon_arr))
afternoon_img = ImageEnhance.Color(afternoon_img).enhance(1.25)
afternoon_img = ImageEnhance.Contrast(afternoon_img).enhance(1.10)
afternoon_img = ImageEnhance.Brightness(afternoon_img).enhance(1.04)
afternoon_img.save('public/images/env_afternoon.jpg', quality=95)
print("Saved env_afternoon.jpg")

# -------------------------------------------------------------
# 2. EVENING (Golden Hour Sunset, Fiery Amber, Warm Radiance)
# -------------------------------------------------------------
# Sunset golden glow: rich red/orange warmth, deep violet shadows, warm glowing windows
evening_arr = base_arr.copy()

# Warm sunset color grading
# R boosted, G balanced with amber, B shifted towards warm violet/indigo
evening_arr[:, :, 0] = np.clip(evening_arr[:, :, 0] * 1.25 + 15, 0, 255)
evening_arr[:, :, 1] = np.clip(evening_arr[:, :, 1] * 0.95 + 5, 0, 255)
evening_arr[:, :, 2] = np.clip(evening_arr[:, :, 2] * 0.70 - 10, 0, 255)

# Add golden-hour sky gradient (rich fiery orange-crimson at horizon y ~ 200..300)
sunset_glow = np.exp(-((y_indices - 220) ** 2) / (2 * 90 ** 2)) * np.exp(-((x_indices - 720) ** 2) / (2 * 450 ** 2))
evening_arr[:, :, 0] = np.clip(evening_arr[:, :, 0] + sunset_glow * 65, 0, 255)
evening_arr[:, :, 1] = np.clip(evening_arr[:, :, 1] + sunset_glow * 35, 0, 255)
evening_arr[:, :, 2] = np.clip(evening_arr[:, :, 2] + sunset_glow * 5, 0, 255)

evening_img = Image.fromarray(np.uint8(evening_arr))
evening_img = ImageEnhance.Color(evening_img).enhance(1.35)
evening_img = ImageEnhance.Contrast(evening_img).enhance(1.15)
evening_img.save('public/images/env_evening.jpg', quality=95)
print("Saved env_evening.jpg")

# -------------------------------------------------------------
# 3. NIGHT (Midnight Sky, Moonlit Mountains, Glowing Windows & Lamps)
# -------------------------------------------------------------
# Cool midnight blue tones across the diorama, while windows and streetlamps glow with warm golden light!
night_arr = base_arr.copy()

# 1. Base dark blue night transformation
# Deep indigo shadows, dark blue midtones, cool highlight moonlight
night_arr[:, :, 0] = np.clip(night_arr[:, :, 0] * 0.18 + 5, 0, 255)
night_arr[:, :, 1] = np.clip(night_arr[:, :, 1] * 0.28 + 12, 0, 255)
night_arr[:, :, 2] = np.clip(night_arr[:, :, 2] * 0.52 + 32, 0, 255)

# 2. Window and Lamp Radiance Extraction
# In the original image, windows (bakery, espresso, houses) and lamps have high warmth (R > G > B and high brightness)
# Detect window areas: especially on right side (x > 700, y > 350)
orig_r = base_arr[:, :, 0]
orig_g = base_arr[:, :, 1]
orig_b = base_arr[:, :, 2]
brightness = (orig_r * 0.299 + orig_g * 0.587 + orig_b * 0.114)

# Window glow mask: warm bright areas in the village and buildings
is_warm_light = (orig_r > 160) & (orig_g > 110) & (orig_r > orig_b + 35) & (brightness > 130)
# Exclude sky (y < 260) and mountain peaks (x < 700 and y < 400)
village_mask = (y_indices > 280) & (x_indices > 500)
lamp_mask = is_warm_light & village_mask

# Crystal glow mask: bottom left purple/cyan crystals (x < 420, y > 580, high blue/red, distinct brightness)
crystal_mask = (x_indices < 420) & (y_indices > 580) & (orig_b > 160) & ((orig_b > orig_g + 20) | (orig_r > orig_g + 20))

# River reflection mask: center river (450 < x < 750, y > 350)
river_mask = (x_indices > 450) & (x_indices < 750) & (y_indices > 350) & (orig_b > 120) & (orig_b > orig_r + 20)

# Apply glowing warm yellow/orange to windows and streetlamps!
# Soften the glow with a blur
glow_layer = np.zeros((H, W, 3), dtype=np.float32)
glow_layer[lamp_mask, 0] = 255
glow_layer[lamp_mask, 1] = 210
glow_layer[lamp_mask, 2] = 80

# Crystals glow with radiant cyan/magenta luminescence
glow_layer[crystal_mask, 0] = 160
glow_layer[crystal_mask, 1] = 220
glow_layer[crystal_mask, 2] = 255

# Apply moonlit highlights to mountain snow (y < 350, x between 100 and 1100, high brightness)
snow_mask = (y_indices < 330) & (orig_r > 190) & (orig_g > 190) & (orig_b > 190)
night_arr[snow_mask, 0] = np.clip(night_arr[snow_mask, 0] * 1.5 + 40, 0, 255)
night_arr[snow_mask, 1] = np.clip(night_arr[snow_mask, 1] * 1.6 + 65, 0, 255)
night_arr[snow_mask, 2] = np.clip(night_arr[snow_mask, 2] * 1.8 + 110, 0, 255)

# Water moonlit shimmer
night_arr[river_mask, 0] = np.clip(night_arr[river_mask, 0] * 1.2 + 25, 0, 255)
night_arr[river_mask, 1] = np.clip(night_arr[river_mask, 1] * 1.3 + 55, 0, 255)
night_arr[river_mask, 2] = np.clip(night_arr[river_mask, 2] * 1.5 + 105, 0, 255)

# Composite glowing windows and lamps
glow_img = Image.fromarray(np.uint8(glow_layer)).filter(ImageFilter.GaussianBlur(radius=3.0))
glow_arr = np.array(glow_img, dtype=np.float32)

# Blend glow into night array
for c in range(3):
    night_arr[:, :, c] = np.clip(night_arr[:, :, c] * (1.0 - (glow_arr[:, :, c] / 255.0) * 0.4) + glow_arr[:, :, c] * 1.15, 0, 255)

# Add pin-prick stars to deep night sky (y < 220)
np.random.seed(42)
star_prob = np.random.rand(220, W)
is_star = star_prob > 0.992
# Make stars twinkle
star_brightness = np.random.uniform(160, 255, size=(220, W))
for c in range(3):
    night_slice = night_arr[:220, :, c]
    night_slice[is_star] = np.clip(night_slice[is_star] + star_brightness[is_star], 0, 255)

night_img = Image.fromarray(np.uint8(night_arr))
night_img = ImageEnhance.Contrast(night_img).enhance(1.2)
night_img.save('public/images/env_night.jpg', quality=95)
print("Saved env_night.jpg")
