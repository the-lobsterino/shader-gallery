#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

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
	vec2 position = ( surfacePosition * 50.);
	
	float a = (atan(position.x, position.y)+(mouse.y*sin(time)+mouse.x)*PI2)+sqrt(length(position/PI)/PI2)-time;
	vec3 col;
	
	col = (hue2rgb((a)/PI *0.5)*length(position));

	gl_FragColor = vec4( col, 1.0 );

}