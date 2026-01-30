#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define EPS 0.0001

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray {
	vec3 p;
	vec3 d;
};	
	
// https://www.shadertoy.com/view/MtSGRc

vec3 cube( Ray i, vec3 c, float s ) {
	// closest + farthest points of cube relative to origin
	vec3 minp = c - vec3(s) * 0.5;
	vec3 maxp = c + vec3(s) * 0.5;
	
	// steps from pos to points
	vec3 neard = (minp - i.p) / i.d;
	vec3 fard = (maxp - i.p) / i.d;
	
	// dir steps needed to reach points
	vec3 nearp = min(neard, fard);
	vec3 farp = max(neard, fard);
	
	// entry/exit vals
	float inear = max(max(nearp.x, nearp.y), nearp.z);
	float ofar = min(min(farp.x, farp.y), farp.z);
	
	if (ofar - inear > EPS) {
		vec3 hitp = i.p + inear * i.d;
		
		if (abs(hitp.x - minp.x) < EPS) return vec3(1., 0., 0.);
		if (abs(hitp.y - minp.y) < EPS) return vec3(0., 1., 0.);
		if (abs(hitp.z - minp.z) < EPS) return vec3(0., 0., 1.);
		if (abs(hitp.x - maxp.x) < EPS) return vec3(-1., 0., 0.);
		if (abs(hitp.y - maxp.y) < EPS) return vec3(0., -1., 0.);
		if (abs(hitp.z - maxp.z) < EPS) return vec3(0., 0., -1.);
		
	
	}
	
	return vec3(0., 0., 0.);
	
}


void main( void ) {
	
	vec2 screencoords = vec2(resolution.x / resolution.y, 1.0) * ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5);

	vec2 position = screencoords - 0.5;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	vec3 beamdir = normalize(vec3(2, screencoords));
	
	Ray beam = Ray(vec3(-0.1, position), beamdir);

	gl_FragColor = vec4(cube(beam, vec3(0.0, -0.1, 0.0), 0.2 * sin(time) + 0.5), 0.1);

}