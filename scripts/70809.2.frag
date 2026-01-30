//Originl code 119 bytes - https://www.dwitter.net/d/21295
#ifdef GL_ES
precision mediump float;
#endif

#define S sin
#define C cos
#define t time/3.
#define X uv.x*64.
#define Y -uv.y*64.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy-.9* resolution.xy )/resolution.y;
	float f=S(t)*3.+9.;
	float o = S(X/f) * C(Y/f)-t;
	gl_FragColor = vec4(hsv2rgb(vec3( o, 3., .2)), 4. );
}
