#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float notrandom (vec2 st) {
	return fract(dot(st,st));
}

void main() {
    vec2 st = surfacePosition;
	
    float dp = dot(st,st);
	
    st /= dp;
	
    st = fract(st);

    float nrnd = fract( notrandom( st ) + dp ); //*3.1415926*2.0);

    gl_FragColor = vec4(vec3(nrnd),6.0);
}