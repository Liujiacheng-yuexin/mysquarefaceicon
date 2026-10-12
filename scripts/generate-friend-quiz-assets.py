"""Original code-drawn QUIZ-001 artwork; uses Pillow only during asset preparation."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/games/friend-block-test'
OUT.mkdir(parents=True, exist_ok=True)

def font(size, bold=False):
    candidates = [Path('C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf'), Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')]
    return ImageFont.truetype(str(next(p for p in candidates if p.exists())), size)

def face(draw, x, y, size, color, style):
    stroke = max(3, size // 45)
    draw.rounded_rectangle((x, y, x+size, y+size), radius=size//9, fill=color, outline='#3f3028', width=stroke)
    draw.rounded_rectangle((x+size*.13, y+size*.14, x+size*.87, y+size*.33), radius=size//18, fill='#3f3028')
    for eye in [.34, .69]:
        draw.ellipse((x+size*(eye-.035), y+size*.48, x+size*(eye+.035), y+size*.60), fill='#3f3028')
    draw.arc((x+size*.36, y+size*.57, x+size*.67, y+size*.80), 0, 180, fill='#3f3028', width=stroke+1)
    if style:
        for eye in [.20, .73]:
            draw.rounded_rectangle((x+size*eye,y+size*.44,x+size*(eye+.19),y+size*.64),radius=size//30,outline='#3f3028',width=stroke)

def render(name, w, h):
    im = Image.new('RGB', (w,h), '#d8f5e1'); d=ImageDraw.Draw(im)
    if name == 'thumbnail':
        face(d, 54, 65, 214, '#ffc780', False); face(d, 239, 213, 214, '#fffdf8', True)
        d.text((52,435),'TEN PICKS. YOUR FRIENDS.',font=font(22,True),fill='#08795e')
    else:
        factor=w/1200
        def text(pos,value,size,color='#3f3028',bold=False): d.text((pos[0]*factor,pos[1]*factor),value,font=font(round(size*factor),bold),fill=color)
        text((64,64),'FRIEND BLOCK TEST',20,'#08795e',True)
        text((60,126),'How well do your',52,bold=True);text((60,192),'friends know you?',52,bold=True)
        text((64,282),'10 questions. Your everyday quirks.',23)
        text((64,318),'Make it. Share it. Compare your picks.',23)
        face(d,int(782*factor),int(109*factor),int(220*factor),'#ffc780',False)
        face(d,int(919*factor),int(293*factor),int(210*factor),'#fffdf8',True)
        text((64,h/factor-74),'MY SQUARE FACE ICON',16,'#08795e',True)
    im.save(OUT/f'{name}.webp',format='WEBP',quality=88,method=6)
    print(name,w,h,(OUT/f'{name}.webp').stat().st_size)

for spec in [('thumbnail',512,512),('cover',960,600),('og',1200,630)]: render(*spec)
