
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
 vec2 pos = ( gl_FragCoord.xy / resolution.xy )* 26.0*mouse.x -13.0*mouse.y;
 vec2 mouse_distance = mouse - (pos.xy / resolution);
 float red = tan(cos(time/pos.y*pos.x) + sin(mouse.y * mouse.x));
 float blue= sin(cos((time/pos.y)*pos.x)-sin(mouse.x*mouse.y ));
 float y =cos(tan((time/pos.y*-pos.x)-tan(mouse.x*mouse.y )));
 gl_FragColor = vec4(red, y, blue, 0);
}