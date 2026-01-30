// trilateration

#ifdef GL_ES
precision highp float;
#endif

#define SAMPLE_METHOD 0
#define CSG_SMOOTH_OPS 0

const float circle_distance = 1.02;
// when an intersection is considered close to surface
const float hit_tolerance = 0.01;

// delta for sampled gradient
const float gradient_delta = 0.01;
const float gradient2_delta = 0.01;
const bool use_smooth_gradient = false;

// smoother csg operators after Pasko et al
// "Function representation in geometric modeling" (1995) that
// better preserve field continuity, but completely
// destroy the euclidean distance estimation
float sdf_union(bool g, float a, float b) {
	if (g == true)
    		return a + b - sqrt(a*a+b*b);
	else
		return min(a,b);
}

float sdf_intersection(bool g, float a, float b) {
	if (g == true)
    		return a + b + sqrt(a*a+b*b);
	else
		return max(a,b);
}

float sdf_difference(bool g, float a, float b) {
	if (g == true)
    		return a - b + sqrt(a*a+b*b);
	else
		return max(a,-b);
}

float sdf_abs(bool g, float u, float v) {
	if (g == true)
    		return sqrt(2.0*(u*u+v*v)) - 2.0*v;
	else
		return abs(u) - v;
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdBox(bool g, vec2 p, vec2 size) {
    float dx = sdf_abs(g, p.x, size.x);
    float dy = sdf_abs(g, p.y, size.y);
    
    float dmx = max(dx, 0.0);
    float dmy = max(dy, 0.0);
    
	if (g == true) {
		return sdf_intersection(g, dx, dy);
	} else {
	
    	return min(max(dx,dy),0.0) + sqrt(dmx*dmx+dmy*dmy);
	}
}

float sdSphere(vec2 p, float r) {
    return length(p) - r;
}

float map_b(bool g, vec2 p) {	
	
	float box = sdBox(g, p, vec2(0.5,0.5));
	//float circle = sdSphere(mod(p,vec2(0.4,0.4))-vec2(0.2,0.2), 0.21);
	float circle = sdSphere(p - vec2(0.4,0.0), (sin(time)*0.5+0.5)*0.5);
	float circle2 = sdSphere(p - vec2(sin(time)*0.4,0.0), 0.3);
	float box2 = sdBox(g, p, vec2(0.3, 0.2));
	
	return sdf_union(g,
		sdf_difference(g, 
		sdf_difference(g, box, circle), box2),
		circle2);
}

float map(vec2 p) {
	return map_b(false, p);
}

vec2 grad(vec2 p) {
	float d = gradient_delta;
	return normalize((vec2(
		map_b(use_smooth_gradient,vec2(p.x+d,p.y)) - map_b(use_smooth_gradient,vec2(p.x-d,p.y)),
		map_b(use_smooth_gradient,vec2(p.x,p.y+d)) - map_b(use_smooth_gradient,vec2(p.x,p.y-d))
	)) / (2.0*d));
}

vec4 grad2(vec2 p) {
	float d = gradient_delta;
	
	return vec4(
		grad(vec2(p.x+d,p.y)) - grad(vec2(p.x-d,p.y)),
		grad(vec2(p.x,p.y+d)) - grad(vec2(p.x,p.y-d))
	);
}

void get_sample_pts(vec2 p, out vec2 p0, out vec2 p1) {
#if SAMPLE_METHOD == 0	
	vec2 g = grad(p)*abs(map(p));
	vec2 ortho = vec2(g.y,-g.x) * circle_distance;
	p0 = p + ortho;
	p1 = p - ortho;
#elif SAMPLE_METHOD == 1
	float d = abs(map(p));
	vec2 g = grad(p)*d*0.1;
	vec2 ortho = g * circle_distance;
	p0 = p + ortho;
	p1 = p - ortho;
#endif
}

bool test_intersection(vec2 p0, vec2 p1, out vec2 hit, out vec2 p3a, out vec2 p3b, out float r0, out float r1) {
	r0 = abs(map(p0));
	r1 = abs(map(p1));

	float d = length(p1 - p0);
	if ((d < (r0+r1)) && (d > abs(r0-r1))) {
		float a = (r0*r0-r1*r1+d*d) / (2.0*d);
		vec2 p2 = p0 + a*(p1 - p0)/d;
		float h = sqrt(r0*r0-a*a);
		vec2 d3 = h*(p1 - p0)/d;
		p3a = p2 + vec2(-d3.y,d3.x);
		p3b = p2 + vec2( d3.y,-d3.x);
		hit.x = clamp(1.0 - (abs(map(p3a)) / hit_tolerance),0.0,1.0);
		hit.y = clamp(1.0 - (abs(map(p3b)) / hit_tolerance),0.0,1.0);	
		return true;
	}
	return false;
}

// based on
// http://paulbourke.net/geometry/circlesphere/
vec3 isect(vec2 f, vec2 p) {
	vec3 color = vec3(0.0);
	vec3 circle_color = vec3(1.0, 0.0, 0.0);
	vec3 hit_color1 = vec3(0.0, 1.0, 1.0);
	vec3 hit_color2 = vec3(0.0, 1.0, 1.0);
	
	vec2 p0,p1;
	get_sample_pts(p, p0, p1);
	
	vec2 hit,p3a,p3b; float r0,r1;
	if (test_intersection(p0,p1,hit,p3a,p3b,r0,r1) == true) {
		circle_color = vec3(0.0, 1.0, 0.0);
		//if (abs(length(f - p2) - 0.01) < 0.002) color += vec3(1.0,1.0,0.0);
		
		if (hit.x > 0.0) {
			hit_color1 = vec3(1.0,0.0,1.0);		
			if (abs(length(f - p3a) - 0.01) < 0.002) color += hit_color1;
		}
		if (hit.y > 0.0) {
			hit_color2 = vec3(1.0,1.0,1.0);		
			if (abs(length(f - p3b) - 0.01) < 0.002) color += hit_color2;
		}
	}

	float l0 = length(f - p0);
	if (min(abs(l0 - r0),abs(l0 - 0.01)) < 0.002)
		color += circle_color;
	float l1 = length(f - p1);
	if (min(abs(l1 - r1),abs(l1 - 0.01)) < 0.002)
		color += circle_color;
	
	return color;
}

vec3 isect2(vec2 f) {
	vec3 color = vec3(0.0);
	
	vec2 p0,p1;
	get_sample_pts(f, p0, p1);
	
	vec2 hit,p3a,p3b; float r0,r1;
	if (test_intersection(p0,p1,hit,p3a,p3b,r0,r1) == true) {
		if (hit.x > 0.0) {
			color += vec3(1.0,0.5,0.0) * hit.x;
		}
		if (hit.y > 0.0) {
			color += vec3(0.0,0.5,1.0) * hit.y;
		}
	}
	
	return color;
}

void main (void) {
	vec2 fragment = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	fragment.x *= resolution.x / resolution.y;
	
	vec2 pointC = 2.0 * mouse - 1.0;
	pointC.x *= resolution.x / resolution.y;

	float d = clamp(map(fragment)*300.0, 0.0, 1.0);
	
	vec3 color = vec3(d*0.5) + isect(fragment,pointC) + isect2(fragment);
	
	#if 0
	vec4 g = grad2(fragment);
	float km = 0.5*(g.x*g.z + g.y*g.w);
	color += mix(vec3(0.0,1.0,0.0), vec3(1.0,1.0,0.0), clamp(km*0.5+0.5,0.0,1.0));
	#endif
	
	gl_FragColor = vec4(color, 1.0);
}