#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.0);
const float rPI = 1.0 / PI;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float lightDiffusion(float x, float r)
{
	r = max(r, 1e-8);
	float k = r * r * r * r;
	
	float a = abs(x) / k + 1.0;
	float b = pow(a, -2.0);
	float c = b / ((b + (1.0 - k)) * exp2(-k) * k);
	
	return c * rPI;	
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	
	vec2 puddlePos = position * 20.0;
	
	float roughness = noise(puddlePos) / 2.0;
	roughness += noise(puddlePos * 2.0) / 4.0;
	roughness += noise(puddlePos * 4.0) / 8.0;
	roughness += noise(puddlePos * 8.0) / 16.0;
	roughness += noise(puddlePos * 16.0) / 32.0;
	roughness += noise(puddlePos * 32.0) / 64.0;
	
	roughness = clamp(roughness * 2.0 - 0.1, 0., 1.0);
	
	color += lightDiffusion(max(distance(position, mouse) - 0.01, 0.0), roughness) * (1.0 - roughness);

	gl_FragColor = vec4(color / (color + 1.0), 1.0 );

}