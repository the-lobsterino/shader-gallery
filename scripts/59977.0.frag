#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Noise section for fancy-boi stuff 
//Default noise values (Defines, fixed values)
#define SCALE 2.8
#define SEED 1833.0
#define OCTAVES 1
#define PERSISTENCE 0.65


//Local noise variables (Local, Each pixel has their own)
float _seed;
float _scale;
float _persistence;

//Reset local variables to default #define'd values
void defaultNoise() {
	_seed = SEED;
	_scale = SCALE;
	_persistence = PERSISTENCE;
}

//1d Hash
float hash(float n) { return fract(sin(n)*_seed); }

//3d hash (uses 1d hash at prime scale offsets for y/z)
float hash3(vec3 v) { return hash(v.x + v.y * 113.0 + v.z * 157.0); }
//Quick 3d smooth noise
float noise(vec3 x) {
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);
	float n = p.x + p.y*157.0 + 113.0*p.z;

	return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
		   mix(	mix( hash(n+113.0), hash(n+114.0),f.x),
			mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float nnoise(vec3 pos, float factor) {	
	float total = 0.0
		, frequency = _scale
		, amplitude = 1.0
		, maxAmplitude = 0.0;
	
	//Accumulation
	for (int i = 0; i < OCTAVES; i++) {
		total += noise(pos * frequency) * amplitude;
		frequency *= 2.0, maxAmplitude += amplitude;
		amplitude *= _persistence;
	}
	
	//Normalization
	float avg = maxAmplitude * .5;
	if (factor != 0.0) {
		float range = avg * clamp(factor, 0.0, 1.0);
		float mmin = avg - range;
		float mmax = avg + range;
		
		float val = clamp(total, mmin, mmax);
		return val = (val - mmin) / (mmax - mmin);
	} 
	
	if (total > avg) { return 1.0; }
	return 0.0;
}
//Default normalization factor of .5
//This maps the range (.25,.75) to (0, 1)
float nnoise(vec3 pos) { return nnoise(pos, .5); }
//Absolute difference
float diff(float a, float b) { return abs(a-b); }
//Fractal difference noise, samples once and applies difference 4 times.
float diffNoise(vec3 pos) {
	float v = nnoise(pos);
	for (int i = 0; i < 2; i++) {
		pos.z += 2.0;
		v = diff(v, nnoise(pos));
	}
	return v;	
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////



#define FIELDSEP 53.0
#define SPHERESIZE 5.30
#define MAXDIST 400.0
vec2 map(in vec3 p) {
	// vec3 wpos = mod(p+.5, 1.0);
	vec2 d1 = vec2(length(p) - SPHERESIZE, 1.0);
	return d1;
}
vec2 opRepMap(in vec3 p, in vec3 c) {
	vec3 q = mod(p+.5*c, c) - .5*c;
	return map(q);
}
vec3 calcNormal(in vec3 p) {
	vec3 e = vec3(0.01, 0.0, 0.0);
	vec3 n;
	n.x = opRepMap(p+e.xyy,vec3(FIELDSEP)).x - opRepMap(p-e.xyy,vec3(FIELDSEP)).x;
	n.y = opRepMap(p+e.yxy,vec3(FIELDSEP)).x - opRepMap(p-e.yxy,vec3(FIELDSEP)).x;
	n.z = opRepMap(p+e.yyx,vec3(FIELDSEP)).x - opRepMap(p-e.yyx,vec3(FIELDSEP)).x;
	
	return normalize(n);
}

vec2 intersect(in vec3 ro, in vec3 rd) {
	vec2 h = vec2(0);
	float t = 0.0;
	for (int i = 0; i < 200; i++) {
		
		h = opRepMap(ro + t * rd, vec3(FIELDSEP));
		if (h.x < 0.0001) { return vec2(t, h.y); }
		t += h.x;
		if (t > MAXDIST) { break; }
	}
	return vec2(0);
}

void main() {
	defaultNoise();
	float aspect = resolution.x / resolution.y;
	
	vec2 uv = (gl_FragCoord.xy / resolution.xy) - .5;
	if (aspect > 1.0) { uv.x *= aspect; } else { uv.y /= aspect; }
	
	vec3 ro = vec3(FIELDSEP*.5, FIELDSEP*.5, time * 15.1);
	vec3 rd = normalize(vec3(2.*uv, 1.));
	
	vec2 t = intersect(ro, rd);
	vec3 col = vec3(0);
	vec3 lig = normalize(vec3(sin(time * 5.), cos(time), -0.6));
	
	if (t.y > 0.5) {
		vec3 pos = ro + t.x*rd;
		vec3 nor = calcNormal(pos);
		
		float amb = .5 + .5 * nor.y;
		float dif = max( 0.0, dot(nor, lig));
		vec3 scol = vec3(0);
		scol.r = nnoise(pos * .01);
		scol.g = nnoise(pos * .05);
		scol.b = nnoise(pos * -.05);
		col  = amb * scol;
		col += dif * scol;
		
		
		
	}
	
	gl_FragColor = vec4(col, 1.0);

}