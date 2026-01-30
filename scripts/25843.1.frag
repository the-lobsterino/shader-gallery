#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 mapColor(vec2 p) {
	return vec3(step(0.0,p.y+sin((p.x))),step(0.,sin(p.x*2.)),step(0.,sin(p.y*2.)));
}

float luminance(vec3 col) {
	return 0.299*col.r + 0.587*col.g + 0.144*col.b;
}
//edge detection with gradients (2 parts)
//https://www.youtube.com/watch?v=j7r3C-otk-U
//https://www.youtube.com/watch?v=jdgTNRDt7Ik
const vec2 epsx = vec2(0.01,0);
#define PI 3.14159265
vec2 gradient(vec2 p) {
	float dx = luminance(mapColor(p+epsx.xy))-luminance(mapColor(p-epsx.xy));
	float dy = luminance(mapColor(p+epsx.yx))-luminance(mapColor(p-epsx.yx));
	float magnitude = sqrt(dx*dx+dy*dy);
	if (dx == 0.)
		dx = 1.;
	float angle = atan(dy,dx);
	return vec2(angle,magnitude);
}
vec3 edgeColor(vec2 p) {
	vec2 g = gradient(p);
	return vec3(g.y);
	
	if (g.x < 0.1 && g.y > 0.5)
		return vec3(1,g);
	else
		return vec3(0,g);
	
}
vec3 mainEdgeColor() {
	float scale = 5.;
	vec2 p = surfacePosition*scale;
	vec2 aspectRatio = vec2(resolution.x/resolution.y,1);
	//vec2 m = mouse.xy*aspectRatio*scale-aspectRatio*scale*.5;
	vec3 col = vec3(0.0);
	
	if (sin(time*2.) > 0.)
		col += mapColor(p);
	else
		col += edgeColor(p);
	return col;
	
}
void main( void ) {
	
	gl_FragColor = vec4( mainEdgeColor(), 1.0 );
	
}