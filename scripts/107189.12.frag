#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;

float fn( vec2 sp, vec2 sz, vec2 f, vec2 r, float t )
{
	vec2 p = floor(256e-3*(t - sp - (r/2.0 - f.xy / r.xy )));
	float t2 = t + sz.x + sz.y;
	float c = 0.5 + 0.5 * cos((p.x - t) * (p.y - t) * fract(1. - fract(t2)));//* time* time* time* time* time* time)));
	
	return c;

}

vec3 pal(float t)
{
	float a = floor(t*255.0);
	float b = a / 2.0;
	float c = b / 2.0;
	return vec3(a,b,c)/256.0;
}

void main( void ) {
	float c = fn( surfacePosition.xy, surfaceSize.xy, gl_FragCoord.xy, resolution.xy, PI - time*1e-3 );
	vec3 o = pal( c );
	gl_FragColor = vec4( o, 1.0);
}