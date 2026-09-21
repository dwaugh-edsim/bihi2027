import fitz

doc = fitz.open('Citizenship 9/textbook/Engaged Citizenship.pdf')
print('Searching for maps...')
found = []
for i, page in enumerate(doc):
    for img in page.get_images():
        xref = img[0]
        base_img = doc.extract_image(xref)
        w, h = base_img['width'], base_img['height']
        if w > 500 and h > 300:
            found.append((i+1, xref, w, h, base_img['ext']))

for item in found:
    print(f"Page {item[0]}, xref {item[1]}: {item[2]}x{item[3]} ({item[4]})")
