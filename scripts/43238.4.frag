#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// afl_ext 2017

#define EULER 2.7182818284590452353602874
#define IEULER 0.367879

float wave(vec2 uv, vec2 emitter, float speed, float phase, float timeshift){
	float dst = distance(uv, emitter);
	return pow(EULER, sin(dst * phase - (time + timeshift) * speed));
}
vec2 wavedrag(vec2 uv, vec2 emitter){
	return normalize(uv - emitter);
}

float getwaves(vec2 position){
    float iter = 0.0;
    float phase = 6.0;
    float speed = 2.0;
    float weight = 1.0;
    float w = 0.0;
    float ws = 0.0;
    float iwaterspeed = 1.0;
    for(int i=0;i<123;i++){
        vec2 p = vec2(sin(iter), cos(iter)) * 300.0;
        float res = wave(position, p, speed, phase, 0.0) * IEULER;
        float res2 = wave(position, p, speed, phase, 0.006) * IEULER;
        position -= wavedrag(position, p) * (res - res2) * weight * 5.0 * iwaterspeed;
        w += res * weight;
        iter += 12.0;
        ws += weight;
        weight = mix(weight, 0.0, 0.12);
        phase *= 1.2;
        speed = pow(speed, 1.014);
    }
    return w / ws;
}

varying vec2 surfacePosition;
void main( void ) {	
	float w = getwaves(surfacePosition);
	
	
	gl_FragColor = vec4( 1.0 - w );

}