from PIL import Image, ImageDraw, ImageFont

img = Image.open('Citizenship 9/resources/nova_scotia_map.jpg').convert('RGB')
draw = ImageDraw.Draw(img)

# Exact geographic coordinates on the 1200x896 map:
# 1. Amherst (Isthmus border): ~ x=365, y=365
# 2. Truro (Head of Cobequid Bay): ~ x=515, y=475
# 3. Annapolis Valley (Kentville): ~ x=330, y=500
# 4. Halifax/Dartmouth (Central South Shore Harbour): ~ x=540, y=600
# 5. Lunenburg (South Shore, south-west of Halifax): ~ x=420, y=660
# 6. Yarmouth (Southwestern tip): ~ x=135, y=915 (let's check height 896)
# 7. Pictou / New Glasgow (North shore): ~ x=660, y=410
# 8. Sydney / Cape Breton (East Cape Breton): ~ x=910, y=300

pins = {
    1: ("Amherst", 370, 360),
    2: ("Truro", 505, 470),
    3: ("Annapolis Valley", 335, 495),
    4: ("Halifax & Dartmouth", 535, 595),
    5: ("Lunenburg", 425, 665),
    6: ("Yarmouth", 145, 875),
    7: ("Pictou County", 655, 405),
    8: ("Sydney (CBRM)", 915, 305)
}

print("Pins defined on 1200x896 base.")
