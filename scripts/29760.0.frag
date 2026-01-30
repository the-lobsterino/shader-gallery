#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist(vec2 v1, vec2 v2) {
	vec2 v = v1-v2;
	return sqrt(v.x*v.x+v.y*v.y);
}

void main( void ) {
	vec4 color = vec4(1.0,0.2,0.1,1.0);

	vec2 pixel = vec2(gl_FragCoord.xy/resolution);
	color *= (sin(pixel.x*PI*8.0+time*16.0)*0.5+2.0)/sqrt(pixel.x*4.0)*0.5-abs(4.0-pixel.y*8.0);
	float d = dist(mouse,pixel)*4.0;
	color *= 1.0/d;
	
	gl_FragColor = color*(3.0+sin(pixel.y-time));

}