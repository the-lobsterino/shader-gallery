#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2 rand22 (vec2 n) {
	float k = rand(n);
	
	return vec2(k, rand(n + k));
}

void main( void ) {

	vec2 position = surfacePosition;//gl_FragCoord.xy / resolution.xy;
	
	vec2 sPos = vec2(0.0, 0.5);
	vec3 color = vec3(0.0);
	float d = 0.0;
	
	const int n = 95;
	float sPosI = 0.5;
	float sPosIy = 0.0;
	
	vec2 randPos = rand22(surfacePosition.xy) * 2.0 - 1.0;
	
	for (int i = 0; i < n; ++i) {
		
		d += sPosI * 0.1 / (distance(position, sPos + randPos * 0.25));
		
		sPosI *= 2.0 / 3.0;
		sPosIy += 0.0;
		
		sPos.x += sPosI;
		sPos.y += sPosIy;
	}
	
	color = vec3(d);

	gl_FragColor = vec4(color, 1.0 );

}