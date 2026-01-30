#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition; 

// -----------------------------------------------------------------

#define PI 3.141592

float dot(vec2 v) { return dot(v,v); }
float dot(vec3 v) { return dot(v,v); }
float dot(vec4 v) { return dot(v,v); }
vec2 pow(vec2 v,float p) { return vec2( pow(v.x,p), pow(v.y,p) ); }
vec3 pow(vec3 v,float p) { return vec3( pow(v.x,p), pow(v.y,p), pow(v.z,p) ); }
vec4 pow(vec4 v,float p) { return vec4( pow(v.x,p), pow(v.y,p), pow(v.z,p), pow(v.w,p) ); }
mat2 rotate2d(float _angle){ vec2 cs = vec2(cos(_angle),sin(_angle)); return mat2(cs.x,-cs.y, cs.y,cs.x); }
vec2 rotate2d( vec2 v, float _angle ) { return v * rotate2d(_angle); }

// -----------------------------------------------------------------

/*
// -----------------------------------------------------------------------------------
// inspired by https://www.shadertoy.com/view/lt33R7

void mainImage(out vec4 c,vec2 z)
{
    z = (z/iResolution.xy-.5)/exp2(iGlobalTime);
    c.xy = abs(z);
	c = texture2D(iChannel0,fract(z*exp2(ceil(-log2(max(c.y,c.x))))));
}
// -----------------------------------------------------------------------------------
*/

float exptime(float s) {
	return exp2(-(fract(time*s)));
}

vec2 cst = vec2( cos(time), sin(time) );

vec4 colorize( vec2 uv ) {
	float n = 0.25+0.5*(1.-cos(-time));
	uv = abs(uv*n-(n*0.5));
	uv = fract( uv * exp2( ceil(-log2(max(uv.y,uv.x)))));
	uv /= 1.-dot(uv,uv);
	vec4 c = vec4( uv.xyx, 1.0 );
	return c; 
}

void squareLimitSequel( out vec4 c, vec2 z ) {
	
	c.xy = abs(z);
	c = colorize( fract( z * exp2( ceil(-log2(max(c.y,c.x))))));
	
}

void main( void ) {
	squareLimitSequel( gl_FragColor, (surfacePosition)/exptime(1.25) );
}

// bpt.2016

