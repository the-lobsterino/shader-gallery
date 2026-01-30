/* Iridule */
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat2(c, -s, s, c);
}

float disp(vec3 p) {
	float f = 16.;
	float t = time;
	return .08 * cos(p.x * f + t) * cos(p.z * f + t) * cos(p.y * f + t);
}

float map(vec3 p) {
	float d = 0.;
	float k = disp(p);
	d = length(p) - .5;
	return d - 0.1/sqrt(max( d + k , d * 0.5 - k * 1.201 ));
}

vec3 normal(vec3 p) {
	vec3 n, E = vec3(.005, 0., 0.);
	n.x = map(p + E.xyy) - map(p - E.xyy);
	n.y = map(p + E.yxy) - map(p - E.yxy);
	n.z = map(p + E.yyx) - map(p - E.yyx);
	return normalize(n);
}
mat2 m =mat2(0.8,0.6, -0.6, 0.8);

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }


float noise(vec3 x) {
	const vec3 step = vec3(110, 241, 171);

	vec3 i = floor(x);
	vec3 f = fract(x);
 
	// For performance, compute the base input to a 1D hash from the integer part of the argument and the 
	// incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

float fbm(vec2 p){
	float f=.0;
	f+= .5000*noise(p); p*= m*2.02;
	f+= .2500*noise(p); p*= m*2.03;
	f+= .1250*noise(p); p*= m*2.01;
	f+= .0625*noise(p); p*= m*2.04;
	
	f/= 0.9375;
	
	return f;
}

void main() {
	vec3 kA = vec3(.1, 0., .1);
	vec3 kD = vec3(.8, .2, 0.);
	vec3 kS = vec3(.8, .9, .1);
	float T = time;
	vec2 uv = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
	//if(abs(uv.y) > 0.3337) discard;
	/*ray origin*/ vec3 ro = vec3(0., 0., -3.); 
	/*ray direction*/vec3 rd = vec3(uv, 1.);
	float t = 0.;
	for (int i = 0; i < 2; i++) {
		vec3 p = ro + rd * t;
		p -= 1.-pow( (fbm(p.xy*30.)),.3);
		t += .8 * map(p);
	}
	vec3 p = ro + rd * t;
	vec3 n = normal(p);
	vec3 lp = normalize(vec3(cos(T), 1., sin(T)) - p);
	float diff = .5 * clamp(dot(lp, n), 0., 1.);
	float spec = .02 * pow(max(dot(reflect(-lp, n), ro), 0.), 3.);
	
	if (t < 3.5) // my raymarch function must be messed?
		//gl_FragColor = vec4(1. / t * t * .01 + .05  + diff + spec);
		//gl_FragColor = vec4(.05 * diff + spec, 1.);
		gl_FragColor = vec4(kA + kD * diff + kS * spec* T*0.01, 1.);
	else
		gl_FragColor = vec4(0.);
}