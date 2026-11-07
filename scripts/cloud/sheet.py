# storyboard contact sheet from out/<slug>/board/*.png: python3 sheet.py <slug> [cols] [shots...], run from the studio folder
import json, sys, pathlib
from PIL import Image, ImageDraw, ImageFont
slug=sys.argv[1]; cols=int(sys.argv[2]) if len(sys.argv)>2 else 8; ids=sys.argv[3:]
root=pathlib.Path.cwd()  # run from the studio folder
tl=json.load(open(root/f'src/episodes/{slug}/timeline.json'))
shots=[s for s in tl['shots'] if not ids or s['id'] in ids]
W,H=270,480; cap=54
def tt(names, size):
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            pass
    return ImageFont.load_default()
font=tt(['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/System/Library/Fonts/Supplemental/Arial Bold.ttf'],16)
small=tt(['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/System/Library/Fonts/Supplemental/Arial.ttf'],12)
rows=(len(shots)+cols-1)//cols
sheet=Image.new('RGB',(cols*(W+8)+8,rows*(H+cap+8)+8),(20,18,30))
d=ImageDraw.Draw(sheet)
for i,s in enumerate(shots):
    im=Image.open(root/f'out/{slug}/board/{s["id"]}.png').convert('RGB').resize((W,H))
    x=8+(i%cols)*(W+8); y=8+(i//cols)*(H+cap+8)
    sheet.paste(im,(x,y))
    d.text((x+4,y+H+4),f'{s["id"]} {s["size"][:24]}',font=font,fill=(255,170,90))
    d.text((x+4,y+H+26),(s.get('line') or '')[:40],font=small,fill=(230,230,230))
out=root/f'out/{slug}/sheet.jpg'; sheet.save(out,quality=85); print(out, sheet.size)
