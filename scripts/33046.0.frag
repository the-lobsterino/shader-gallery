#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float fade(float t) { return t * t * t * (t * (t * 6. - 15.) + 10.); }
vec3 smooth(vec3 x) { return vec3(fade(x.x), fade(x.y), fade(x.z)); }

vec3 hash(vec3 co) {
    float m = dot(co, vec3(12.9898, 78.233, 24.1021));
    return fract(vec3(sin(m),cos(m), sin(m))* 43758.5453) * 2. - 1.;
}

float cosfr(float v){
	return cos(abs(v) * 3.1415) * 0.5 + 0.5;	
}
vec3 mirroredfract(vec3 v){
	return vec3(cosfr(v.x), cosfr(v.y), cosfr(v.z));
}

float perlinNoise(vec3 uv) {
	float x = uv.z;
    vec3 PT  = floor(uv);
	PT.z = cosfr(x);
    vec3 pt  = fract(uv);
	pt.z = cosfr(x);
    vec3 mmpt = smooth(pt);
    
    vec4 grads = vec4(
    	dot(hash(PT + vec3(.0, 1., 1.)), pt-vec3(.0, 1., 1.)),   dot(hash(PT + vec3(1., 1., 1.)), pt-vec3(1., 1., 1.)),
        dot(hash(PT + vec3(.0, .0, 1.)), pt-vec3(.0, .0, 1.)),   dot(hash(PT + vec3(1., .0, 1.)), pt-vec3(1., 0., 1.))
    );

    return 5.*mix (mix (grads.z, grads.w, mmpt.x), mix (grads.x, grads.y, mmpt.x), mmpt.y);
}

float fbm(vec3 uv) {
    float finalNoise = 0.;
    finalNoise += .50000*perlinNoise(2.*uv);
    finalNoise += .25000*perlinNoise(4.*uv);
    finalNoise += .12500*perlinNoise(8.*uv);
    finalNoise += .06250*perlinNoise(16.*uv);
    finalNoise += .03125*perlinNoise(32.*uv);
    
    return finalNoise;
}

void main() {
	vec2 res = gl_FragCoord.xy * vec2(0.1, 100.0);
	vec2 position = res / resolution.y;
	gl_FragColor = vec4( vec3( fbm(vec3(3.*position, time * 0.00001)) ), 1.0 );
}