// fork of (http://glslsandbox.com/e#73745.0) by Prince Polka
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
	return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

float fn( vec2 m )
{
	float a = length(m);
	float b = dot(m,m);
	return radians( a/b );
}

void main() {
    vec2 st = abs(surfacePosition*(262144.0*fn(mouse)));//gl_FragCoord.xy/200.0;
    float m = mod(time,dot(st,st));
    st = (mod(st,m))-m/2.0;
    float f = fract(st.x*st.y/length(st));
    vec3 a = vec3(f);
    vec3 b = pal(f);
    vec3 c = mix(a,b,m);
    gl_FragColor = vec4(c,1.0);
}