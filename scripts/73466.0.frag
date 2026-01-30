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
const float TAU = 2.0 * PI;

/*
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return (a + b*cos( TAU*(c*t+d) ));
}

vec3 pal(float t) {
	return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

float fm(vec2 m)
{
	m = ((m * 2.0 - 1.0)- (resolution.xy/2.0)) * resolution.xy;
	return (m.y/m.x);
}

float fn(float x)
{
	float n = 2.0 * x*x;//*(1.0-x);
	float y = cos(x*(n)*PI*fm(mouse));
	y = abs(y);
	return 1.0-y*y; // * 0.5 + 0.5;
}
*/

void main( void ) {
	
	vec2 s = abs((surfacePosition)); 
	
	float i = time*10.0 + ( (resolution.x*resolution.y/2.0-gl_FragCoord.y * resolution.x + gl_FragCoord.x) );
	
	//i = i / (resolution.x*resolution.y);
	
	//float d = (dot(s,s));
	
	//float f = fn( d + i );//(1.0 - d / i) / (1.0 - i*i) );
	
	//float o = (f + i) / (1.0+f*f);//fn(f+fn(i+f*i+surfaceSize.x*surfaceSize.y));
	
	//o = fract( o );
	
	float o = fract( s.x*s.y + i);
	
	gl_FragColor = vec4( vec3(o), 1.0 );

}