#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float hash2(vec2 co){
	return fract(dot(co,co)+time*0.125);
}

vec3 hash13(float t)
{
	vec2 pos = vec2(t,1.0-t);
	float col = hash2(pos);
	vec3 o = vec3(1.0,2.0,3.0)*col+col;
	o = fract(o*t+t);
	return o;
}

float hash22(vec2 sp,vec2 sz)
{
	float t = (sp.y * sz.x + sp.x) / (sz.x * sz.y);
	return t;
}

void main( void ) {
	
	gl_FragColor = vec4( hash13( hash22(surfacePosition,surfaceSize) * hash22(gl_FragCoord.xy,resolution) ), 1.0);

}