#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926
#define PI2 (PI * 2.)

//Based of http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hue2rgb(float hue){
    vec3 p = abs(fract(hue + K.xyz) * 6.0 - K.www);
    return clamp(p - K.xxx, 0.0, 1.0);
}

void main( void ) {

	float speed = 1.;
	float scale = 2.;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse;
	
	float a = atan(position.x, position.y);
	vec3 col;
	
	col = hue2rgb(a / PI *0.5);

	gl_FragColor = vec4( col, 1.0 );

}