precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define address TAU/abs(gl_FragCoord.y * resolution.x + gl_FragCoord.x)
#define ct cos(address*(surfaceSize.x*surfaceSize.y))
#define A cos(ct+ct/dot(surfacePosition,surfacePosition))
#define B sin(ct-ct/dot(surfacePosition,1.0-surfacePosition.yx))

const float PI = 3.1415926;
const float TAU = 2.0 * PI;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return (a + b*cos( TAU*(c*t+d) ));
}

vec3 pal(float t) {
	return pal( t, vec3(0.5),vec3(0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

float f(float x)
{
	x = cos(x);
	return 4.0 * x - x*x - 1.0;
}

void main( void ) {
	
	vec2 p = surfacePosition*f(ct);
	vec2 m = (mouse * TAU - PI) * abs(surfaceSize.x*surfaceSize.y);
	
	float c = cos(ct+m.y)*ct;
	float s = sin(ct+m.x)*ct;
	
	p *= mat2(c,s,-s,c);
	
	float t = abs(p.y+p.x) / dot(p,p);
	
	t = fract(t+cos(A)+cos(B)+time);

	gl_FragColor = vec4( pal( t ), 1.0);

}