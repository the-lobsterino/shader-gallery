#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

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

	vec2 p = surfacePosition;
	vec2 m = cos(p*(16.0*TAU)) * (mouse * 2.0 - 1.0);//vec2((p.x),(p.y));
	float t = dot(p,p)*dot(0.1/(m*length(m)),m);//fract( fract(m.y*m.x)*surfaceSize.x + fract(p.y*p.x*surfaceSize.y*surfaceSize.x)*surfaceSize.y  );
	gl_FragColor = vec4( pal(t+time), 1.0 );

}
