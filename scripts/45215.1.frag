#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float hash( float n ){
    return fract(sin(n)*758.5453);
}

/*
Copyright afl_ext (achlubek)
Released to PUBLIC DOMAIN

contains 1d 2d 3d 4d noises with the same characteristics
do whatever you want.

*/

#define EULER 2.7182818284590452353602874
// its from here https://github.com/achlubek/venginenative/blob/master/shaders/include/WaterHeight.glsl 
float wave(vec3 uv, vec3 emitter, float speed, float phase, float timeshift){
	float dst = distance(uv, emitter);
	return pow(EULER, sin(dst * phase - (time + timeshift) * speed)) / EULER;
}
vec3 wavedrag(vec3 uv, vec3 emitter){
	return normalize(uv - emitter);
}

#define DRAG_MULT 4.0

float seed = 0.0;

float oct(float p){
    return fract(4768.1232345456 * sin(p));
}

vec3 rand3d(){
    	float x = oct(seed);
	seed += 1.0;
    	float y = oct(seed);
	seed += 1.0;
    	float z = oct(seed);
	seed += 1.0;
	return vec3(x,y,z) * 2.0 - 1.0;
}

float getwaves(vec3 position){
    position *= 0.1;
	float iter = 0.0;
    float phase = 6.0;
    float speed = 2.0;
    float weight = 1.0;
    float w = 0.0;
    float ws = 0.0;
    for(int i=0;i<20;i++){
        vec3 p = rand3d() * 30.0;
        float res = wave(position, p, speed, phase, 0.0);
        float res2 = wave(position, p, speed, phase, 0.006);
        position -= wavedrag(position, p) * (res - res2) * weight * DRAG_MULT;
        w += res * weight;
        iter += 12.0;
        ws += weight;
        weight = mix(weight, 0.0, 0.2);
        phase *= 1.2;
        speed *= 1.02;
    }
    return w / ws;
}

vec2 xyzToPolar(vec3 xyz){
    float theta = atan(xyz.y, xyz.x);
    float phi = acos(clamp(xyz.z, -1.0, 1.0));
    return vec2(theta, phi) / vec2(2.0 *3.1415,  3.1415);
}

vec3 polarToXyz(vec2 xy){
    xy *= vec2(2.0 *3.1415,  3.1415);
    float z = cos(xy.y);
    float x = cos(xy.x)*sin(xy.y);
    float y= sin(xy.x)*sin(xy.y);
    return normalize(vec3(x,y,z));
}

float terrain(vec3 dir){
	vec4 coord = vec4(dir, mouse.x + mouse.y);
	float a = getwaves(coord.xyz * 10.0) * 0.5
		+ getwaves(coord.xyz * 20.0) * 0.25
		+ getwaves(coord.xyz * 40.0) * 0.125;
	return a;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float t = terrain(polarToXyz(position));
	float color = ((t - 0.4) * 4.0) * smoothstep(0.4, 0.41, t);

	gl_FragColor = vec4( color );

}