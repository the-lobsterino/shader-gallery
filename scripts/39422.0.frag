// just for practice
#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 center;
vec4 color;
vec4 red;
vec4 green;
vec4 blue;
void main( void ) {
	red = vec4(1.0,0.0,0.0,1.0);
	green = vec4(0.0,1.0,0.0,1.0);
	blue = vec4(0.0,0.0,1.0,1.0);

	vec2 a = gl_FragCoord.xy / resolution.xy;
	a-=0.5;
	vec2 b = vec2(0.5,0.5);

	vec2 c = vec2(a.x*b.y - a.y*b.x,a.x*b.x + a.y*b.y);
        float angle = (atan(c.x,c.y)+3.1415)/2.095;
	if(angle < 1.0){
	color = red*(1.0-angle) + green*angle;
	
	} else if (angle < 2.0){
	color = green*(2.0-angle) + blue*(angle-1.0);
	}
	else if(angle < 3.0){
	color = blue*(3.0-angle) + red*(angle-2.0);
	}

	gl_FragColor = color*2.0;

}