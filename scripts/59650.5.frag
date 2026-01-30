precision highp float;

#extension GL_OES_standard_derivatives : enable
#define PI 3.141592653

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 c, vec2 s1, float s2){
	return fract(sin(dot(c.xy, s1)) * s2);
}

float noise(vec2 p, float freq, vec2 s1, float s2){
	float unit = 1.0 / freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)), s1, s2);
	float b = rand((ij+vec2(1.,0.)), s1, s2);
	float c = rand((ij+vec2(0.,1.)), s1, s2);
	float d = rand((ij+vec2(1.,1.)), s1, s2);
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res, vec2 s1, float s2){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f, s1, s2);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}

const int landscapeLevels = 40;
const int cloudsLevels = 8;
const int landscapeComplexity = 32;
const int cloudsComplexity = 16;
const float cloudsIntensity = 0.4;
const float levelOffset = 0.36;

const int sea1 = 15;
const int sea2 = 16;
const int sea3 = 17;
const int beach = 18;
const int grass1 = 19;
const int grass2 = 20;
const int grass3 = 21;
const int mountain1 = 24;
const int mountain2 = 27;
const int mountain3 = 35;

vec3 sea = vec3 (0.1, 0.14, 0.73);
vec3 sand = vec3 (0.87, 0.88, 0.42);
vec3 grass = vec3 (0.1, 0.59, 0.11);
vec3 mountain = vec3 (0.24, 0.24, 0.25);
vec3 snow = vec3 (0.97);

vec3 landscape (float v) {
	v = clamp (v * 3.0, 0.0, 1.0);
	return mix (
		sea,
		mix (
			sand,
			mix (
				grass,
				mix (
					mountain,
					snow,
					clamp (6.0 * (v - 0.7), 0.0, 1.0)
				),
				clamp (6.0 * (v - 0.2), 0.0, 1.0)
			),
			clamp (50.0 * (v - 0.02), 0.0, 1.0)
		),
		clamp (60.0 * (v - 0.001), 0.0, 1.0)
	);
}

vec3 clouds (float v) {
	return vec3(clamp (v - 0.13, 0.0, 0.2) * 5.0) * cloudsIntensity;
}

const vec2 vseed1 = vec2(12.9898,78.233);
const float fseed1 = 43758.5453;
const vec2 vseed2 = vec2(45.33123, -21.36146);
const float fseed2 = 73151.457712;
const vec2 vseed3 = vec2(45.33123, -21.36146);
const float fseed3 = 73151.457712;

const float cameraScale = 2.0;

vec2 levelSize = vec2(20.0, 20.0);
const float voronoiDistance = 0.1;
const int numCells = 200;
const int numIslandCells = 60;
const float voronoiNoiseScale = 0.1;

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	p *= cameraScale;
	p.x *= resolution.x / resolution.y;
	p += vec2 (cos (time / 130.0) * levelSize.x * 0.5, sin (time / 150.0) * levelSize.y * 0.5);

	float perlin1 = pNoise(p, landscapeComplexity, vseed1, fseed1);
	float perlin2 = pNoise(p + vec2 (time / 36.0, time / 40.0), cloudsComplexity, vseed2, fseed2);
	float perlin3 = pNoise(p, 4, vseed3, fseed3);
	float voronoi = 0.0;
	
	for (int i = 0; i < numCells; i++) {
		vec2 v = vec2 (
			rand ( vec2 (float(i), 0.0), vseed3, fseed3 ) * 2.0 - 1.0,
			rand ( vec2 (0.0, float(i)), vseed3, fseed3 ) * 2.0 - 1.0
		);
		
		float d = length ((p / levelSize) - v) + voronoiNoiseScale * perlin3;
		if (d < voronoiDistance && i < numIslandCells) {
			voronoi += (1.0 / voronoiDistance) * (voronoiDistance - d);
		}
	}
	
	vec3 landscape = landscape (perlin1 * voronoi);
	vec3 clouds = clouds (perlin2);

	gl_FragColor = vec4( landscape + clouds, 1.0 );

}