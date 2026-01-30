#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
/*
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D fft;

uniform vec4 unPar;
uniform vec4 unPos;
uniform vec3 unBeatBassFFT;
*/

float sphere(in vec3 ro, in vec3 rd)
{
	float radius = 1.0;
	float b = 2.0 * dot(ro, rd);
	float c = dot(ro, ro) - radius * radius;
	float h = b * b - 4.0 * c;
	
	if (h < 0.0) {
		return -1.0;
	} else {
		return ((-b - sqrt(h)) / 2.0);
	}
}

float intersect(in vec3 ro, in vec3 rd)
{
	float t = sphere(ro, rd); // generate sphere
	return t;
}

void main( void ) {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 col = vec3(uv.x);
	
	// generate a ray with origin ro and direction rd
	vec3 ro = vec3(0.0, 1.0, 4.0);
	vec3 rd = normalize(vec3(-1.0 + 2.0 + uv, -1.0));
	
	// intersect the ray with the 3d scene
	float id = intersect(ro, rd);
	
	if (id > 0.0) {
		// hit something, draw white
		col = vec3(1.0, 1.0, 1.0);
	}
	

	gl_FragColor = vec4(col, 1.0 );

}