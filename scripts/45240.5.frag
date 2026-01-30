#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
uniform vec2  screen;

vec2  center  = vec2(0.0, 0.0);
float radius  = 0.4;
float border  = 0.2;
float blur    = 0.01;
float scale   = 12.0;
vec3  c       = vec3(1.0,1.0,1.0);

void main( void ) {
 vec2  	p = (gl_FragCoord.xy * scale - resolution) /min(resolution.x,resolution.y);
 //vec2 p = gl_FragCoord.xy * scale  / resolution;
 float  x = p.x;
 float  y = p.y;
 float 	t = step(1.0 / x, y);
 vec4 	b = vec4(0.0, 0.6, 0.8, 1.0);
 vec4 	f = vec4(c, 1.0);

 gl_FragColor = mix(f, b, t);
}