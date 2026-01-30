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

	vec2 position = surfacePosition;// - mouse; //( gl_FragCoord.xy / resolution.xy ) - mouse;
	position /= dot(position,position);
	vec2 cut = (sin(position * (surfaceSize * TAU) ));//vec2(100.0, 50.0)));
	float a = tan(cut.x + cut.y);
	float b = tan(cut.x * cut.y);
	float c = tan(cut.x / cut.y);
	float d = a+b+c;// + 1.0) / 2.0;

	gl_FragColor = vec4( pal(fract(exp(d/surfaceSize.x))), 1.0);

}