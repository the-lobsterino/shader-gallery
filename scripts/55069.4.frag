// https://www.shadertoy.com/view/4dBGRw 111

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PHI = 1.61803398874989484820459 * 00000.1; // Golden Ratio   
float PI  = 3.14159265358979323846264 * 00000.1; // PI
float SQ2 = 1.41421356237309504880169 * 10000.0; // Square Root of Two

float gold_noise(float seed)
{
    return fract(tan(distance(vec2(seed) * (seed + PHI), vec2(PHI, PI))) * SQ2);
}

vec4 DrawExplosion(vec2 position, float frame, float seed)
{
	vec4 explosionColour = vec4(gold_noise(seed+PHI), gold_noise(seed+PI), gold_noise(seed+SQ2), 1.0);
	
	//
	
	vec4 renderColour = vec4(0.0);
	
	vec2 point = vec2(1.0, 0.0);
	
	mat2 rr = mat2(cos(1.0),-sin(1.0), sin(1.0), cos(1.0));
	
	for (float particle = 1.0; particle < 24.0; particle += 1.0)
	{
		float fade = (particle / 24.0) * frame;
		
		float d = cos(particle * sin(particle * seed) * seed);
		
		vec2 particpos = frame * point * d;
		
		point = point * rr;
		
		float particleDistance = dot(particpos - position, particpos - position);
		
		renderColour = mix((explosionColour / fade), renderColour, smoothstep(0.0, 0.001, particleDistance));
	}
	
	renderColour *= smoothstep(0.0, 1.0, (1.0 - frame) / 1.0);
	
	return renderColour;
}


void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	uv = 1.0 - (2.0 * uv);
	
	if (resolution.x > resolution.y)
		uv.x *= (resolution.x / resolution.y);
	else
		uv.y *= (resolution.y / resolution.x);	
	
	gl_FragColor = DrawExplosion(uv, mod(time, 1.0), floor(time) + 1.0);
}
