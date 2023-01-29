import svgwrite
import sys

def create_svg(path, name, text):

    svg_size = 200
    font_size = 100

    dwg = svgwrite.Drawing(f'{path}/{name}.svg', (svg_size, svg_size), debug=True)
    dwg.embed_font(name="Montserrat", filename='backend/static/fonts/Montserrat.ttf')
    gradient = dwg.defs.add(dwg.radialGradient())
    gradient.add_stop_color(0, 'lightblue').add_stop_color(1, 'skyblue')

    dwg.add(dwg.circle(center=("50%", "50%"), 
                       r='50%', 
                       fill=gradient.get_paint_server(), 
                       stroke='black', 
                       stroke_width=1))
    dwg.add(dwg.text(text.upper(),
                     insert=('50%', font_size*1.35),
                     text_anchor="middle", 
                     font_family='Montserrat',
                     font_weight='bold',
                     font_size=font_size, 
                     fill='white'))
    
    dwg.save()

    return f'{path}/{name}.svg'