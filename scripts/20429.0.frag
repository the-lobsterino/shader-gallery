// Planet rendering
// Written by Frank Gennari
// 10/6/14
// Note: incomplete

#ifdef GL_ES
precision lowp float;
#endif

// standard uniforms
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// global constants (to be changed by the user)
const float viewer_z      = 2.0;
const vec3 planet_pos     = vec3(0,0,0);
const float planet_radius = 0.25;
const float moon_radius   = 0.06;
const float atmos_radius  = 0.26;
const float sun_radius    = 0.4; // far away
const float orbit         = 0.5;
const float terrain_scale = 1.0;
const float noise_scale   = 1.0;
const vec3 atmos_density  = vec3(1.0, 0.0, 0.0); // {constant, linear, quadratic}
const vec3 atmos_inner_col= vec3(1.0, 1.0, 1.0); // white
const vec3 atmos_outer_col= vec3(0.0, 0.0, 1.0); // blue
#define NUM_OCTAVES 8


// v1 is the line dir, p1 is the line start point, sphere center is at (0,0,0), sphere radius is 1.0
vec3 line_sphere_int(in vec3 v1, in vec3 p1) {
	float t = -dot(v1, p1); // v1 should be normalized
	vec3 v2 = p1 + v1*t;
	float v2len = length(v2); // sqrt of length of perpendicular to sphere center
	return v2 - v1*sqrt(1.0 - v2len*v2len); // distance along line to outside surface of sphere
}

vec3 ray_hit_dir(in vec2 screen_pos) {
	vec3 p1 = vec3(screen_pos, viewer_z);
	return normalize(line_sphere_int(vec3(0,0,1), p1));
}

// create soft edges by fading to alpha near the edges of the planet
float get_alpha_for_dist(in float dist) {
	return min(1.0, 100.0*(1.0 - dist));
}

vec3 draw_planet(in vec3 color, in vec3 normal, in vec3 sun_dir, in float diffuse_scale);
void apply_atmosphere(inout vec3 cur_color, in vec3 sun_pos, in vec3 moon_pos, in vec3 light_dir,
		      in vec3 normal, in vec3 position, in vec3 camera_pos);
float simplex(in vec2 v);
float calc_sphere_shadow_atten(in vec3 pos, in vec3 lpos, in float lradius, in vec3 spos, in float sradius);
void adjust_normal_for_craters(inout vec3 norm, in vec3 vertex);

void main(void) {
	float rmin = min(resolution.x, resolution.y);
	vec2 position  = ((gl_FragCoord.xy - 0.5*resolution.xy) / rmin);

	vec3 sun_dir = normalize(vec3(2.0*mouse.x-1.0, 2.0*mouse.y-1.0, -0.5));
	vec3 sun_pos = 10.0*sun_dir;
	float angle  = 0.25*time;
	vec3 moon_pos = planet_pos + orbit*vec3(sin(angle), 0.0, cos(angle)); // orbits around y-axis
	vec2 ppos = position - planet_pos.xy;
	vec2 mpos = position - moon_pos.xy;
	bool in_planet = (length(ppos) < planet_radius);
	bool in_moon   = (length(mpos) < moon_radius);
	vec3 p_normal  = ray_hit_dir(ppos/planet_radius);
	vec3 real_ppos = planet_pos + p_normal*planet_radius;
	vec3 color;

	if (in_moon && (!in_planet || moon_pos.z < 0.0)) { // in moon (and in front of planet)
		vec3 normal = ray_hit_dir(mpos/moon_radius);
		vec3 pos = moon_pos + normal*moon_radius;
		float ds = calc_sphere_shadow_atten(pos, sun_pos, sun_radius, planet_pos, planet_radius);
		adjust_normal_for_craters(normal, normal); // slow
		color = draw_planet(vec3(0.5,0.5,0.5), normal, sun_dir, ds);
	}
	else if (in_planet) {
		float ds = calc_sphere_shadow_atten(real_ppos, sun_pos, sun_radius, moon_pos, moon_radius);
		color = draw_planet(vec3(0.5,0.5,1.0), p_normal, sun_dir, ds);
	}
	else { // background stars
		float intensity = min(1.0, 4.0*(simplex(100.0*position) - 0.8));
		color = vec3(intensity);
	}
	if (length(ppos) < atmos_radius && (!in_moon || moon_pos.z > 0.0)) {
		vec3 camera_pos = vec3(position, viewer_z);
		apply_atmosphere(color, sun_pos, moon_pos, sun_dir, p_normal, real_ppos, camera_pos);
	}
	gl_FragColor = vec4(color, 1.0);
}

vec3 draw_planet(in vec3 color, in vec3 normal, in vec3 light_dir, in float diffuse_scale) {
	float diffuse = 0.95*diffuse_scale*max(0.0, dot(normal, light_dir));
	float ambient = 0.05;
	return color*(diffuse + ambient);
}

// ****************** SPHERE SHADOW ************************

float pt_line_dist(in vec3 P, in vec3 L1, in vec3 L2) {
	return length(cross((L2 - L1), (L1 - P)))/distance(L2, L1);
}

// analytical soft sphere shadow with spherical light source
float calc_sphere_shadow_atten(in vec3 pos, in vec3 lpos, in float lradius, in vec3 spos, in float sradius) {
	float atten = 1.0;
	float ldist = length(lpos - pos);

	if (ldist > length(lpos - spos)) { // behind the shadowing object
		const float PI = 3.14159;
		float d = pt_line_dist(spos, lpos, pos);
		float r = sradius;
		float R = lradius*length(spos - pos)/ldist;
		float tot_area = PI*R*R;

		if (d < abs(R - r)) { // fully overlapped
			atten *= 1.0 - PI*min(r,R)*min(r,R)/tot_area;
		}
		else if (d < (r + R)) { // partially overlapped
			float shadowed_area = r*r*acos((d*d+r*r-R*R)/(2.0*d*r)) + R*R*acos((d*d+R*R-r*r)/(2.0*d*R)) - 0.5*sqrt((-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R));
			atten *= 1.0 - clamp(shadowed_area/tot_area, 0.0, 1.0);
		}
	}
	return atten;
}

// ****************** ATMOSPHERE ************************

float get_density_at(vec3 pos) {
	float dist = distance(pos, planet_pos);
	float v = 1.0 - clamp((dist - planet_radius)/(atmos_radius - planet_radius), 0.0, 1.0);
	return dot(atmos_density, vec3(1.0, v, v*v));
}

void apply_atmosphere(inout vec3 cur_color, in vec3 sun_pos, in vec3 moon_pos, in vec3 light_dir,
		      in vec3 normal, in vec3 position, in vec3 camera_pos) {
	float ascale = min(4.0*(dot(normal, light_dir) + 0.25), 1.0);
	if (ascale <= 0.0) return;

	// alpha is calculated from distance between sphere intersection points
	float wpdist   = distance(position, planet_pos);
	vec3 ldir      = normalize(position - camera_pos);
	float dp       = dot(ldir, (position - planet_pos));
	float adist_sq = dp*dp - wpdist*wpdist + atmos_radius*atmos_radius;
	if (adist_sq <= 0.0) discard; // no sphere intersection
	float dist     = sqrt(adist_sq);
	float pdist_sq = dp*dp - wpdist*wpdist + planet_radius*planet_radius;
	if (pdist_sq > 0.0) {dist -= sqrt(pdist_sq);} // ray intersects planet, adjust distance
	vec3 pos       = position - ldir*(dp + 0.5*dist); // midpoint of ray in atmosphere
	float density  = get_density_at(pos)*dist/atmos_radius;
	float alpha    = ascale*clamp(4.0*density, 0.0, 1.0);
	float lt_atten = 1.0;

	if (sun_radius > 0.0 && moon_radius > 0.0) {
		lt_atten *= calc_sphere_shadow_atten(position, sun_pos, sun_radius, moon_pos, moon_radius);
	}
	vec3 color = vec3(0.05); // ambient only
	color += lt_atten*max(0.0, dot(normal, light_dir)); // diffuse
	vec3 scatter_color = mix(atmos_outer_col, atmos_inner_col, min(1.6*density, 1.0));
	cur_color = mix(cur_color, color*scatter_color, alpha);
}

// ****************** SIMPLEX NOISE ************************

vec3 mod289(in vec3 x) {
	return x - floor(x * 1.0 / 289.0) * 289.0;
}
vec3 permute(in vec3 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}
vec4 mod289(in vec4 x) {
	return x - floor(x * 1.0 / 289.0) * 289.0;
}
vec4 permute(in vec4 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

float simplex(in vec2 v)
{
	vec4 C = vec4(
		 0.211324865405187,  // (3.0 -  sqrt(3.0)) / 6.0
		 0.366025403784439,  //  0.5 * (sqrt(3.0)  - 1.0)
		-0.577350269189626,	 // -1.0 + 2.0 * C.x
		 0.024390243902439); //  1.0 / 41.0

	// First corner
	vec2 i  = floor(v + dot(v, C.yy));
	vec2 x0 = v - i   + dot(i, C.xx);

	// Other corners
	vec2 i1 = (x0.x > x0.y) ? vec2(1, 0) : vec2(0, 1);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12 = vec4(x12.xy - i1, x12.z, x12.w);

	// Permutations
	i = mod(i, vec2(289)); // Avoid truncation effects in permutation
	vec3 p = permute(permute(i.y + vec3(0, i1.y, 1)) + i.x + vec3(0, i1.x, 1));
	vec3 m = max(vec3(0.5) - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3(0));
	m = m * m;
	m = m * m;

	// Gradients: 41 points uniformly over a line, mapped onto a diamond.
	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
	vec3 x = 2.0 * fract(p * C.w) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	// Normalise gradients implicitly by scaling m
	// Inlined for speed: m *= taylorInvSqrt(a0*a0 + h*h);
	m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

	// Compute final noise value at P
	vec3 g;
	g.x  = a0.x  * x0.x   + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

float simplex(in vec3 v)
{
	vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
	vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

	// First corner
	vec3 i = floor(v + dot(v, vec3(C.y)));
	vec3 x0 = v - i + dot(i, vec3(C.x));

	// Other corners
	vec3 g = step(vec3(x0.y, x0.z, x0.x), x0);
	vec3 l = vec3(1.0 - g);
	vec3 i1 = min(g, vec3(l.z, l.x, l.y));
	vec3 i2 = max(g, vec3(l.z, l.x, l.y));

	//   x0 = x0 - 0.0 + 0.0 * C.xxx;
	//   x1 = x0 - i1  + 1.0 * C.xxx;
	//   x2 = x0 - i2  + 2.0 * C.xxx;
	//   x3 = x0 - 1.0 + 3.0 * C.xxx;
	vec3 x1 = x0 - i1 + C.x;
	vec3 x2 = x0 - i2 + C.y; // 2.0*C.x = 1/3 = C.y
	vec3 x3 = x0 - D.y;      // -1.0+3.0*C.x = -0.5 = -D.y

	// Permutations
	i = mod289(i); 
	vec4 p = vec4(permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0)));

	// Gradients: 7x7 points over a square, mapped onto an octahedron.
	// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
	float n_ = 0.142857142857; // 1.0/7.0
	vec3 ns = n_ * vec3(D.w, D.y, D.z) - vec3(D.x, D.z, D.x);

	vec4 j = vec4(p - 49.0 * floor(p * ns.z * ns.z));  //  mod(p,7*7)
	vec4 x_ = vec4(floor(j * ns.z));
	vec4 y_ = vec4(floor(j - 7.0 * x_));    // mod(j,N)
	vec4 x = vec4(x_ * ns.x + ns.y);
	vec4 y = vec4(y_ * ns.x + ns.y);
	vec4 h = vec4(1.0 - abs(x) - abs(y));
	vec4 b0 = vec4(x.x, x.y, y.x, y.y);
	vec4 b1 = vec4(x.z, x.w, y.z, y.w);

	// vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
	// vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
	vec4 s0 = vec4(floor(b0) * 2.0 + 1.0);
	vec4 s1 = vec4(floor(b1) * 2.0 + 1.0);
	vec4 sh = -step(h, vec4(0.0));

	vec4 a0 = vec4(b0.x, b0.z, b0.y, b0.w) + vec4(s0.x, s0.z, s0.y, s0.w) * vec4(sh.x, sh.x, sh.y, sh.y);
	vec4 a1 = vec4(b1.x, b1.z, b1.y, b1.w) + vec4(s1.x, s1.z, s1.y, s1.w) * vec4(sh.z, sh.z, sh.w, sh.w);
	vec3 p0 = vec3(a0.x, a0.y, h.x);
	vec3 p1 = vec3(a0.z, a0.w, h.y);
	vec3 p2 = vec3(a1.x, a1.y, h.z);
	vec3 p3 = vec3(a1.z, a1.w, h.w);

	// Normalise gradients
	//vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
	vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;

	// Mix final noise value
	vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), vec4(0));
	m = m * m;
	return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ****************** RAND GEN ************************

float rand_01  (float val) {return fract(sin(12.9898 * val) * 43758.5453);}
float rand_pm1 (float val) {return 2.0*(rand_01(val) - 0.5);}
vec3  rand_vec3(float val) {return vec3(rand_pm1(val), rand_pm1(val+1.0), rand_pm1(val+2.0));}

// ****************** CRATERS ************************

// add craters by modifying the normal
// assumes the object center is at (0,0,0) in world space
// normal is in eye space
// vertex is in world space (or could be the normal)
void adjust_normal_for_craters(inout vec3 norm, in vec3 vertex) {
	
	float v0 = 1.0; // using a variable here is slow
	vec3 dir = normalize(vertex); // world space normal

	for (int i = 0; i < 50; ++i) { // Note: inefficient, but fast enough for a single object render (depth complexity=1)
		vec3 center = rand_vec3(v0);
		vec3 dir2   = dir - normalize(center);
		float dist  = length(dir2);
		float rad1  = 0.15*(0.25 + 0.75*rand_01(v0+3.0));
		float rad2  = 1.5*rad1;
		v0         += 4.0;
		
		if (dist < rad2) { // at crater (parabola)
			vec3 cnorm = normalize(dir2/dist);
			float cwt;

			if (dist < rad1) { // inside crater
				cwt  = 0.75*dist/rad1; // higher power?
				cnorm = -cnorm;
			}
			else { // on rim of crater
				cwt  = 0.5*sqrt(1.0 - (dist - rad1)/(rad2 - rad1));
			}
			norm = normalize(mix(norm, cnorm, smoothstep(0.0, 1.0, cwt)));
		}
	}
}

// ****************** PERLIN CLOUDS 3D ************************

#define RIDGED_NOISE

float gen_cloud_alpha_time(in vec3 pos, in vec3 ftime)
{
	float alpha = 0.0;
	float freq  = 1.0;

	for (int i = 0; i < NUM_OCTAVES; ++i) {
		float v = simplex(noise_scale*(freq*pos + ftime));
#ifdef RIDGED_NOISE
		v = 2.0*v - 1.0; // map [0,1] range to [-1,1]
		v = 1.0 - abs(v); // ridged noise
		v = v*v;
#endif
		alpha += v/freq;
		freq  *= 2.0;
	}
	return 2.0*(0.5*alpha-0.4);
}

float fract_smooth(in float t) {
	return 2.0*abs(fract(0.5*t) - 0.5);
}

vec3 get_ftime() {
	return vec3(fract_smooth(time), fract_smooth(0.95*time), fract_smooth(0.85*time));
}

float gen_cloud_alpha_non_norm(in vec3 pos) {
	return gen_cloud_alpha_time(pos, get_ftime());
}
float gen_cloud_alpha(in vec3 pos) {
	return clamp(gen_cloud_alpha_non_norm(pos), 0.0, 1.0);
}
float gen_cloud_alpha_static_non_norm(in vec3 pos) {
	return gen_cloud_alpha_time(pos, vec3(0.0));
}

// ****************** PROCEDURAL PLANET ************************

float eval_terrain_noise_base(in vec3 npos, const in float gain, const in float lacunarity) {
	float val  = 0.0;
	float mag  = 1.0;
	float freq = 0.5; // lower freq for ridged noise

	for (int i = 0; i < NUM_OCTAVES; ++i) { // similar to gen_cloud_alpha_time()
		float v = simplex(freq*npos);
		v = 2.0*v - 1.0; // map [0,1] range to [-1,1]
		v = max(0.0, (0.75 - abs(v))); // ridged noise
		val  += v*mag;
		freq *= lacunarity;
		mag  *= gain;
	}
	return val;
}

float eval_terrain_noise(in vec3 npos) {
	return 0.7*eval_terrain_noise_base(npos, 0.7, 2.0);
}
float eval_terrain_noise_normal(in vec3 npos) {
	return eval_terrain_noise_base(npos, 0.5, 1.92);
}

// ****************** PLANET DRAWING ************************