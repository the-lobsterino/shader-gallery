#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 sigmaA = vec3(0.0);
const vec3 sigmaS = vec3(0.00000519673, 0.0000121427, 0.0000296453);
const vec3 sigmaE = sigmaS + sigmaA;

const vec3 a = vec3(0.5);
const vec3 b = vec3(0.5);

const float PI = acos(-1.0);

float density(vec2 p) {
	float dist = length(p) - 0.5;
	
	return exp(-dist * 40.) * 10000.;
}

float calculateOpticalDepth(vec2 p, vec2 dir) {
	const int steps = 16;
	
	float rayDist = 0.05;
	float od = 0.0;
	
	for (int i = 0; i < steps; i++) {
		od += density(p) * rayDist;
		p += dir * rayDist;
		
		rayDist *= 1.5;
	}
	
	return od;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 wp = (position * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	
	float theta = mouse.x * PI * 2.0;
	
	vec2 sDir = normalize(vec2(cos(theta), sin(theta)));
	
	float depth = density(wp);
	vec3 vExt = exp(-depth * sigmaE);
	vec3 integral = (1.0 - vExt) / sigmaE;
	
	float ldepth = calculateOpticalDepth(wp, sDir);
	
	vec3 newSigmaS = sigmaS;
	vec3 newSigmaE = sigmaE;
	
	vec3 scattering = vec3(0.0);
	float phase = 0.25;
	
	for (int i = 0; i < 32; i++) {
		
		scattering += integral * newSigmaS * phase * exp(-ldepth * newSigmaE);
		
		newSigmaS *= a;
		newSigmaE *= b;
	}
	
	vec3 color = vec3(scattering);
	
	color = pow(color, vec3(1.0 / 2.2));

	gl_FragColor = vec4(color, 1.0 );

}