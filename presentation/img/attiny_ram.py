#!/usr/bin/env python3

colors= ['rgba(0, 255, 78, 0.4)', 'rgba(0, 137, 255, 0.4)', 'rgba(61, 95, 90, 0.55)']

def colormap(px, py):
    num= py*32+px

    if (num<46):
        return 0
    elif (num<94+46):
        return 1
    else:
        return 2

body= '\n'.join('<rect x="{}" y="{}" width="0.8" height="0.8" fill="{}" />'
                .format(px+0.1, py+0.1, colors[colormap(px, py)])
                for px in range(32)
                for py in range(16))

header= '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
version="1.1" baseProfile="full"
viewBox="0 0 32 16">'''

footer= '</svg>'

print (header + body + footer)
