#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float T = mod(time, 1000.0);

float star_radius = 5.0;

float dscene(vec3 ro) {
	return length(ro) - star_radius;
}

vec4 raytrace(vec3 ro, vec3 rd) {
	for (int i = 0; i < 100; ++i) {
		float d = dscene(ro);
		ro += d * rd;
		if (d < 0.01) {
			// hit
			return vec4(ro, 1.0);
		}
	}
	return vec4(ro, 0.0);
}


// Star Nest by Pablo Roman Andrioli

// This content is under the MIT License.

#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850


// 2D test
// based on: https://www.shadertoy.com/view/XlfGRj
vec3 stars(vec2 uv) {
	//mouse rotation
	float t = time * 0.0001;
	vec3 from = vec3(t*2.,t, -1.0);
	
	//volumetric rendering
	float s=0.1,fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec2 rot_uv = uv * mat2(cos(s), sin(s), -sin(s), cos(s));
		vec3 p=vec3(rot_uv, -s) * 0.25 + from;
		float repeat = 2.0;
		p = mod(p+0.5*repeat, repeat) - 0.5*repeat;
		p *= 10.0;
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		a*=a*a; // add contrast
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	return v*.01;
}

float hash(vec2 uv) {
	return fract(sin(dot(uv, vec2(123.45, 678.9))) * 987654.321);
}

float noise2(vec2 uv) {
	vec2 i = floor(uv);
	vec2 f = fract(uv);
	vec2 b = smoothstep(0.0, 1.0, f);
	return mix(
		mix(hash(i), hash(i + vec2(1.0, 0.0)), b.x),
		mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), b.x), b.y);
}

float hash3(vec3 v3) {
	return fract(sin(dot(v3, vec3(12.34, 45.67, 89.01))) * 987654.321);
}


// based on:
// https://github.com/keijiro/PerlinNoise/blob/master/Assets/Perlin.cs#L42
float noise3(vec3 v3) {
	vec3 i = floor(v3);
	vec3 f = fract(v3);
	vec3 b = smoothstep(0.0, 1.0, f);
	return mix(
		mix(
			mix(hash3(i + vec3(0.0, 0.0, 0.0)), hash3(i + vec3(1.0, 0.0, 0.0)), b.x),
			mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), b.x), b.y),
		mix(
			mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), b.x),
			mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), b.x), b.y),
		b.z
	);
}

float octave3(vec3 v3) {
	//return noise3(v3 * 12.34);
	return 2.0 * noise3(v3 * 3.21) - 1.0;
}

float height3(vec3 v3) {
	float h = 0.0;
	float amp = 0.8;
	float freq = 0.2;
	mat3 m = mat3(1.0, 0.9, -0.8, 0.7, -0.6, 0.5, -0.4, 0.3, 0.2);
	for (int i = 0; i < 3; ++i) {
		//h += amp * (octave3(freq * (v3 + vec3(0.0, 0.0, t))) + octave3(freq * (v3 - vec3(0.0, 0.0, t))));
		h += amp * octave3(freq * v3);
		amp *= 0.2;
		freq *= 2.0;
		v3 *= m;
	}
	return h;//2.0 * h - 1.0;
}

// https://twistedpairdevelopment.wordpress.com/2013/02/11/rotating-a-vector-by-a-quaternion-in-glsl/
vec3 rotate_vector(vec4 quat, vec3 vec) {
	return vec + 2.0 * cross(cross(vec, quat.xyz) + quat.w * vec, quat.xyz);
}

vec4 q_axis_angle(vec3 axis, float angle) {
	float h = angle * 0.5;
	return vec4(normalize(axis) * sin(h), cos(h));
}

vec3 shade_planet(vec4 ro4, vec3 rd) {
	float h = height3(rotate_vector(q_axis_angle(vec3(-0.5, 1.0, 0.5), T * 0.1), ro4.xyz));// + T);
	if (h > 0.0) {
		// land
		return vec3(0.0, 0.0, 0.0);
	} else {
		// sea
		return vec3(0.0, 0.0, 0.0);
	}	
}

vec3 shade(vec2 uv, vec4 ro4, vec3 rd) {
	vec3 center_star = vec3(0.0);
	float edge = 0.5;
	//return mix(stars(uv), stars(uv), smoothstep(star_radius - edge, star_radius + edge, length(ro4.xy)));
	return stars(uv);
	//return stars(ro4, rd);
}


vec3 render(vec2 uv, vec3 ro, vec3 rd) {
	return shade(uv, raytrace(ro, rd), rd);
}

void main( void ) {

	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 ro = vec3(0.0, 0.0, 10.0);
	vec3 rd = normalize(vec3(uv, -1.0));

	vec3 color = render(uv, ro, rd);
	gl_FragColor = vec4( color, 1.0 );

}