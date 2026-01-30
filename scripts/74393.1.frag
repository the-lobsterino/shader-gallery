#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = 2.0 * PI;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return (a + b*cos( TAU*(c*t+d) ));
}

vec3 pal(float t) {
	return pal( t, vec3(0.5),vec3(0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

void main( void ) {

	vec2 p = floor(surfacePosition*(PI*PI*PI*PI*PI));// gl_FragCoord.xy / resolution.xy;
	float m = floor(dot(p,p)-p.x*p.y+surfaceSize.x*surfaceSize.y);//+time
	//m = (((m)+gl_FragCoord.y*resolution.x+gl_FragCoord.x));
	m = tan( (m*m) * 2.0 - 3.0 * p.x +time);
	gl_FragColor = vec4( pal( (m) ), 1.0 );

}