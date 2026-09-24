from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT=Path("docs/media"); OUT.mkdir(parents=True,exist_ok=True)
REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
C={"page":"#f6f7f8","surface":"#ffffff","border":"#dce2e5","text":"#20292f","muted":"#647178","accent":"#206a59","soft":"#f5f7f8",
   "darkpage":"#171d20","darksurface":"#222b2f","darkborder":"#3b484e","darktext":"#edf2f1","darkmuted":"#b1c0c2","darkaccent":"#83d2b1"}
def font(n,b=False): return ImageFont.truetype(BOLD if b else REG,n)
def rr(d,b,r,fill,outline=None,w=1): d.rounded_rectangle(b,r,fill=fill,outline=outline,width=w)
def t(d,xy,s,n=16,fill="#20292f",b=False,anchor=None): d.text(xy,s,font=font(n,b),fill=fill,anchor=anchor)
def btn(d,b,label,primary=False):
    rr(d,b,7,C["accent"] if primary else C["surface"],None if primary else "#cbd4d8")
    t(d,((b[0]+b[2])//2,(b[1]+b[3])//2),label,13,"white" if primary else C["text"],True,"mm")
def qr(d,x,y,s=142):
    d.rectangle((x,y,x+s,y+s),fill="white"); q=s//25
    for yy in range(25):
        for xx in range(25):
            if (xx*7+yy*11+xx*yy)%13<5: d.rectangle((x+xx*q,y+yy*q,x+(xx+1)*q-1,y+(yy+1)*q-1),fill="#111")
    for ox,oy in ((1,1),(17,1),(1,17)):
        d.rectangle((x+ox*q,y+oy*q,x+(ox+7)*q,y+(oy+7)*q),fill="#111")
        d.rectangle((x+(ox+1)*q,y+(oy+1)*q,x+(ox+6)*q,y+(oy+6)*q),fill="white")
        d.rectangle((x+(ox+2)*q,y+(oy+2)*q,x+(ox+5)*q,y+(oy+5)*q),fill="#111")
def header(d,w,dark=False,mobile=False):
    surf=C["darksurface"] if dark else C["surface"]; border=C["darkborder"] if dark else C["border"]; fg=C["darktext"] if dark else C["text"]; muted=C["darkmuted"] if dark else C["muted"]; accent=C["darkaccent"] if dark else "#202e35"
    left=16 if mobile else 80; right=w-16 if mobile else w-80; y=63 if mobile else 73
    d.line((left,y,right,y),fill=border); rr(d,(left,18 if mobile else 23,left+29,47 if mobile else 52),6,accent); t(d,(left+14,32 if mobile else 37),"↗",19,surf,False,"mm"); t(d,(left+40,32 if mobile else 38),"BlinkSend",17 if mobile else 19,fg,True,"lm")
    if mobile:
        for box,label in [((210,18,284,52),"English"),((291,18,340,52),"Light" if dark else "Dark"),((346,18,382,52),"•••")]: rr(d,box,6,surf,border); t(d,((box[0]+box[2])//2,35),label,10,fg,False,"mm")
    else:
        for box,label in [((w-365,24,w-285,58),"English"),((w-275,24,w-222,58),"Dark"),((w-212,24,w-159,58),"•••")]: rr(d,box,6,surf,border); t(d,((box[0]+box[2])//2,41),label,11,fg,False,"mm")
        t(d,(w-135,41),"GitHub",12,muted,False,"mm")
def landing(w,h,dark=False,mobile=False):
    page=C["darkpage"] if dark else C["page"]; surf=C["darksurface"] if dark else C["surface"]; border=C["darkborder"] if dark else C["border"]; fg=C["darktext"] if dark else C["text"]; muted=C["darkmuted"] if dark else C["muted"]; accent=C["darkaccent"] if dark else C["accent"]
    im=Image.new("RGB",(w,h),page); d=ImageDraw.Draw(im); header(d,w,dark,mobile)
    x=16 if mobile else 120; y=104 if mobile else 135; t(d,(x,y),"Move files directly.",34 if mobile else 42,fg,True); t(d,(x,y+(49 if mobile else 58)),"No account, no cloud storage. Pick a side and connect.",13 if mobile else 16,muted)
    if mobile:
        cards=[(16,185,w-16,339,"Send","Choose files or a folder, then share the QR code.","↑"),(16,357,w-16,511,"Receive","Open or paste the invite link from the sending device.","↓")]
    else:
        cards=[(120,236,482,426,"Send","Choose files or a folder, then share the QR code.","↑"),(498,236,860,426,"Receive","Open or paste the invite link from the sending device.","↓")]
    for x1,y1,x2,y2,title,sub,icon in cards:
        rr(d,(x1,y1,x2,y2),12,surf,border); t(d,(x1+28,y1+28),icon,28,accent); t(d,(x1+28,y1+87 if not mobile else y1+74),title,21,fg,True); t(d,(x1+28,y1+123 if not mobile else y1+108),sub,12 if mobile else 13,muted)
    return im
def split(kind="pair",p=.68):
    im=Image.new("RGB",(1080,610),C["page"]); d=ImageDraw.Draw(im)
    for col,title in enumerate(("↗ BlinkSend · Sender","↗ BlinkSend · Receiver")):
        x=22+526*col; rr(d,(x,20,x+510,590),14,C["surface"],C["border"]); t(d,(x+24,51),title,15,C["text"],True); d.line((x+24,78,x+486,78),fill=C["border"])
    if kind=="pair":
        t(d,(46,112),"Connect a device",21,C["text"],True); t(d,(46,145),"Scan the QR code or type the pairing code.",13,C["muted"]); qr(d,46,178)
        rr(d,(46,337,414,417),8,C["soft"],C["border"]); t(d,(61,352),"Pairing code",11,C["muted"]); t(d,(61,376),"7K4M-9Q2X",22,C["text"],True); t(d,(61,403),"Valid until 16:08.",11,C["muted"])
        t(d,(574,112),"Receive files",21,C["text"],True); t(d,(574,145),"Enter the code shown on the sender.",13,C["muted"]); rr(d,(574,188,894,232),7,C["surface"],"#cbd4d8"); t(d,(590,210),"7K4M-9Q2X",15,C["text"],False,"lm"); btn(d,(906,188,1030,232),"Use code",True); btn(d,(574,252,694,294),"Scan QR"); btn(d,(706,252,830,294),"Find nearby")
    elif kind=="verify":
        for x in (46,574):
            d.ellipse((x,112,x+8,120),fill="#298768"); t(d,(x+18,116),"Connected · Direct · Excellent",13,C["muted"],False,"lm"); rr(d,(x,151,x+440,306),9,C["soft"],C["border"]); t(d,(x+14,166),"VERIFY DEVICE",11,C["muted"],True); t(d,(x+14,190),"728 491",28,C["text"],True); t(d,(x+14,232),"Make sure both screens show the same code.",13,C["muted"]); btn(d,(x+14,258,x+134,296),"Codes match",True)
    else:
        for x in (46,574): d.ellipse((x,112,x+8,120),fill="#298768"); t(d,(x+18,116),"Connected · Direct · Excellent · 86 MB/s",13,C["muted"],False,"lm")
        for x,action,speed in ((46,"Sending","84"),(574,"Receiving","82")):
            t(d,(x,164),"Holiday Photos.zip",15,C["text"],True); t(d,(x+420,164),"2.4 GB",13,C["muted"],False,"ra"); t(d,(x,193),f"Batch {2.4*p:.1f} GB of 2.4 GB · file 1/1",12,C["muted"]); rr(d,(x,219,x+440,229),5,"#e4e8ea"); rr(d,(x,219,x+int(440*p),229),5,C["accent"])
            if p<1: t(d,(x,252),f"{action} {2.4*p:.1f} GB of 2.4 GB · {speed} MB/s · ~{max(1,int(15*(1-p)))}s left",12,C["muted"])
            else: rr(d,(x,248,x+440,296),8,"#eff8f4","#b9d9cd"); t(d,(x+14,272),"✓ Transfer complete — file verified.",14,"#185c48",True,"lm")
    return im
def cursor(im,x,y,click=0,label=None):
    im=im.copy(); d=ImageDraw.Draw(im,"RGBA")
    if click:
        r=int(14+26*click); d.ellipse((x-r,y-r,x+r,y+r),outline=(32,106,89,int(170*(1-click))),width=5)
    pts=[(x,y),(x+4,y+33),(x+12,y+24),(x+23,y+40),(x+31,y+35),(x+20,y+19),(x+32,y+15)]
    d.polygon(pts,fill="white",outline="#14191b"); d.line(pts+[pts[0]],fill="#14191b",width=3)
    if label:
        bb=d.textbbox((0,0),label,font=font(14,True)); tw=bb[2]-bb[0]; th=bb[3]-bb[1]; bx=min(im.width-tw-28,x+38); by=max(12,y-18); rr(d,(bx,by,bx+tw+20,by+th+14),9,(32,106,89,235)); d.text((bx+10,by+7),label,font=font(14,True),fill="white")
    return im
def ease(v): return 3*v*v-2*v*v*v
def move(base,a,b,n,label):
    out=[]
    for i in range(n):
        q=ease(i/max(1,n-1)); x=int(a[0]+(b[0]-a[0])*q); y=int(a[1]+(b[1]-a[1])*q); out.append(cursor(base,x,y,0,label if i>n//2 else None))
    for i in range(4): out.append(cursor(base,b[0],b[1],i/4,label))
    return out
def save_gif(frames,path,duration):
    picks=[round(i*(len(frames)-1)/11) for i in range(12)]
    frames=[frames[i].resize((480,271),Image.Resampling.LANCZOS).quantize(colors=24,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE) for i in picks]
    frames[0].save(path,save_all=True,append_images=frames[1:],duration=duration,loop=0,optimize=True,disposal=2)

landing(1280,820).save(OUT/"desktop.webp","WEBP",quality=88,method=6)
landing(390,844,mobile=True).save(OUT/"mobile.webp","WEBP",quality=88,method=6)
landing(390,844,dark=True,mobile=True).save(OUT/"mobile-dark.webp","WEBP",quality=88,method=6)
pair,verify=split("pair"),split("verify")
frames=[cursor(pair,150,520)]*4 + move(pair,(150,520),(948,210),9,"Enter code")
frames += [Image.blend(pair,verify,(i+1)/5) for i in range(4)] + move(verify,(948,210),(140,278),8,"Compare") + move(verify,(140,278),(668,278),8,"Same code") + [cursor(verify,668,278,0,"Verified")]*5
save_gif(frames,OUT/"pairing.gif",230)
frames=move(split("transfer",.05),(110,500),(165,165),8,"Send file") + [cursor(split("transfer",i/14),165,165,0,"P2P transfer") for i in range(2,14)] + [cursor(split("transfer",1),165,165,0,"SHA-256 verified")]*6
save_gif(frames,OUT/"transfer.gif",210)
for name in ("desktop.webp","mobile.webp","mobile-dark.webp","pairing.gif","transfer.gif"):
    p=OUT/name; print(name,p.stat().st_size)
