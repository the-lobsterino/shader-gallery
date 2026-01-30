
// can someone upload a faster way to draw this?
// i dont how to draw it more efficient


#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
uniform vec2 mouse;
varying vec2 surfacePosition;
uniform vec2 resolution;
uniform float time;

vec2 uv;
vec2 center;
float circle(vec2 pos, float radius) {
	return smoothstep(radius+0.01, radius, distance(pos, uv));
}
 
void main( void ) 
{
	uv = gl_FragCoord.xy/min(resolution.x, resolution.y);
	center = vec2(resolution)/min(resolution.x, resolution.y)*0.5;
	vec4 col = vec4(0.0);
	float scale = 2.4;
	for (int i=0; i<20; ++i) {
		if (mod(float(i), 2.) > 0.) col.rgba -= vec4(circle(center, 0.2*scale));
		else col.rgba += vec4(circle(center, 0.2*scale));
		scale -= 0.1;
		center.x += sin(time*1.)*.015;
		center.y += cos(time*1.)*.012;
		col.r *= float(i)/10.;
		col.g *= float(i)/15.;
		col.b *= float(i)/10.*sin(time*0.2);
	}
	gl_FragColor = col;
	
}