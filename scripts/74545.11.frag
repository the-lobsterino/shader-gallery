#extension GL_OES_standard_derivatives : enable

// intplosion

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

//#define time 3.141592/4.0

const float PI = 3.1415926;
const float TAU = 2.0 * PI;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return (a + b*cos( TAU*(c*t+d) ));
}

vec3 pal(float t) {
	return pal( t, vec3(0.5),vec3(0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

float fn(vec2 p)
{
	float m = (p.x*p.y);
	m = cos( (m) * (TAU * 64.0) - TAU * (p.x-p.y));
	return abs(m);	
}

vec2 m()
{
	return vec2(fract(time),1.0-fract(time));//mouse * 2.0 - 1.0;
}

mat2 ro(float a)
{
	float n = TAU * TAU;
	float z = radians(m().x) * (time);
	float s = mod(sin(a) * z,n);
	float c = mod(cos(a) * z,n);
	return mat2( c, s, -s, c );
}

float c(vec2 p)
{
	float t = radians(m().y) * (time);
	float a = fn(p);
	p *= ro( a + dot(p,p) * t);
	return fract(a) * fn(p);
}

void main( void ) {

	vec2 p = floor(surfacePosition*(TAU*TAU*TAU)+vec2(fn(surfaceSize),1.0-fn(surfaceSize)));
	float v = c(p);
	gl_FragColor = vec4( mix(vec3(fract(v)),pal( ((v+time))), abs(sin(time)) ), 1.0 );

}