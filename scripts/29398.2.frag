#ifdef GL_ES
precision lowp float;
#endif
#define UP vec3(0.0, 1.0, 0.0)
#define DOWN vec3(0.0, -1.0, 0.0)
#define PI 3.14159265359
#define BACK vec3(0.0, 0.0, -1.0)
#define EPSILON 0.001

#define LEFT vec3(1.0, 0.0, 0.0)
#define RIGHT vec3(-1.0, 0.0, 0.0)


#define INFINITY 100000.0
#define NO_HIT Hit(INFINITY, vec3(0.0), vec3(0.0), vec3(0.0))
#define RETURN_NO_HIT {test.dist = INFINITY; return;}
#define BOUNCES 3
#define SMOOTH_FACTOR 0.90
#define SAMPLES_PR_FRAME 10

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

struct Hit{
	float dist;
	vec3 color;
	vec3 position;
	vec3 normal;
};
Hit test, result = NO_HIT;

	
struct Light {
	vec3 position;
	float intensity;
	vec3 color;
};
	
Light light1 = Light(vec3(7.5, 7.5, 0.0), 100.0, vec3(1.0));


void trace_sphere(out Hit test, in vec3 p, in vec3 d, vec4 params, vec3 color){
	vec3 oc = p - params.xyz;
	float b = 2.0 * dot(d, oc);
	float c = dot(oc, oc) - params.w*params.w;
	float disc = b * b - 4.0 * c;
	
	if (disc < 0.0) RETURN_NO_HIT;
	float q;
	if (b < 0.0) {
		q = (-b - sqrt(disc))/2.0;
	} else {
		q = (-b + sqrt(disc))/2.0;
	}
	float t0 = q;
	float t1 = c / q;
	
	if(t0 < 0.0) t0 = INFINITY;
	if(t1 < 0.0) t1 = INFINITY;
	float dist = min(t0, t1);
	if (dist == INFINITY)RETURN_NO_HIT;
	
	vec3 pos = p + d * dist;
	test = Hit(dist, color, pos, normalize(pos - params.xyz));
}

void trace_plane(out Hit test, in vec3 p, in vec3 d, vec4 equation, vec4 posr, vec3 color){
	float t = -(dot(equation.xyz, p) + equation.w) / dot(d, equation.xyz);
	if(t < 0.0) RETURN_NO_HIT;
	
	vec3 pos = p + t * d;
	
	vec3 diff = abs(posr.xyz - pos);
	
	float planarDist = max(diff.x, max(diff.y, diff.z));
	
	if(planarDist > posr.w) RETURN_NO_HIT;
	
	test = Hit(t, color, pos, equation.xyz);
}
	
#define RESOLVE if(test.dist < result.dist && dot(d, test.normal) < 0.0 ){ result = test; }
#define TRACE_SPHERE(params, color) trace_sphere(test, p, d, params, color); RESOLVE;

#define TRACE_PLANE(position, normal, radius, color) trace_plane(test, p, d, vec4(normal, -dot(position, normal)), vec4(position, radius), color); RESOLVE;

void trace(in vec3 p, in vec3 d){
	TRACE_SPHERE(vec4(0.0, 0.0, 0.0, 2.5), vec3(1.0, 1.0, 1.0));
	
	// Floor
	TRACE_PLANE(vec3(0.0, -10.0, 0.0), UP, 10.0, vec3(0.0, 1.0, 0.0));
	
	// Roof
	TRACE_PLANE(vec3(0.0, 10.0, 0.0), DOWN, 10.0, vec3(0.0, 0.0, 1.0));
	
	// Back
	TRACE_PLANE(vec3(0.0, 0.0, 10.0), BACK, 10.0, vec3(1.0, 1.0, 0.0));
	
	// Left
	TRACE_PLANE(vec3(10.0, 0.0, 0.0), RIGHT, 10.0, vec3(.0, 1.0, 1.0));
	
	// Right
	TRACE_PLANE(vec3(-10.0, 0.0, 0.0), LEFT, 10.0, vec3(1.0, 0.0, 1.0));
}


vec2 seed;

vec2 rand2n() {
    	seed+=vec2(-1,1);
	return vec2(fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453),
		fract(cos(dot(seed.xy ,vec2(4.898,7.23))) * 23421.631));
}

vec3 ortho(vec3 v) {
    	return abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)  : vec3(0.0, -v.z, v.y);
}

vec3 getSampleBiased(vec3  dir, float power) {
	dir = normalize(dir);
	vec3 o1 = normalize(ortho(dir));
	vec3 o2 = normalize(cross(dir, o1));
	vec2 r = rand2n();
	r.x=r.x*2.*PI;
	r.y=pow(r.y,1.0/(power+1.0));
	float oneminus = sqrt(1.0-r.y*r.y);
	return cos(r.x)*oneminus*o1+sin(r.x)*oneminus*o2+r.y*dir;
}

vec3 getSample(vec3 dir) {
	return getSampleBiased(dir,0.0); // <- unbiased!
}

vec3 getCosineWeightedSample(vec3 dir) {
	return getSampleBiased(dir,1.0);
}

vec3 skycolor(in vec3 d){
	return vec3(1.0);
}

vec3 render(vec3 p, vec3 d){
	vec3 luminance = vec3(1.0);
	for(int i = 0 ; i < BOUNCES ; i ++){
		result.dist = INFINITY;
		trace(p, d);
		if(result.dist == INFINITY){
			return luminance * skycolor(d);	
		}
		d = getSample(result.normal);
		p = result.position + result.normal*EPSILON*2.0;
		luminance *= result.color * 1.0 * 2.0 * dot(d, result.normal);
	}
	
	return vec3(0.0);
}


void main( void ) {
	seed = gl_FragCoord.xy / resolution.xy;
	vec3 prev = texture2D(backbuffer, seed).xyz;
	
	vec2 position = seed * 2.0 - 1.0;
	seed *= cos(time) * 753.0;
	position.x *= resolution.x / resolution.y;
	
	vec3 cameraTarget = vec3(0.0);
	vec3 cameraPosition = vec3((mouse.x * 80.0 - 40.0), -(mouse.y * 80.0 - 40.0), -40.0);
	
	vec3 forward = normalize(cameraTarget - cameraPosition);
	vec3 left    = normalize(cross(forward, UP));
	vec3 up      = normalize(cross(left, forward));
	
	vec3 rd      = normalize( forward * 2.0 + left * position.x + up * position.y);
	
	vec3 color = vec3(0.0);
	for(int i = 0 ; i < SAMPLES_PR_FRAME ; i ++){
		color += render(cameraPosition, rd) / float(SAMPLES_PR_FRAME);
	}
	
	gl_FragColor = vec4(mix(color, prev, SMOOTH_FACTOR), 1.0 );
}