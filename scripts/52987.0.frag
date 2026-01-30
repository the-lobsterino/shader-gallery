#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2 rand22(vec2 n){
	return vec2(rand(n), rand(n + 1.0)) * 2.0 - 1.0;
}

float noise12(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

vec2 noise22(vec2 p){
	return normalize(vec2(noise12(p), noise12(p + 100.0)) * 2.0 - 1.0);	
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	
	
	vec2 dither = rand22(position);
	position = position + dither * 1000000.0;

	vec2 tp = abs(fract(position+(vec2(sin(time*0.05),cos(time*0.05))*0.5) * 8.) * 2.0 - 1.0);

	vec3 color = vec3(1.0);
	     color *= smoothstep(0.99,1.0,max(tp.x, tp.y));

	gl_FragColor = vec4(color, 1.0 );

}