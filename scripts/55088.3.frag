// https://www.shadertoy.com/view/4dBGRw   444

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 DrawExplosion(vec2 uv, vec3 explosionColour, float frame, float size, float seed)
{
	vec3 renderedColour = vec3(0.0);
	
	vec2 point = vec2(1.0, 0.0);
	
	mat2 rr = mat2(cos(1.0),-sin(1.0), sin(1.0), cos(1.0));
	
	float particleSize  = (size * 100.0);
	
	for (float particle = 1.0; particle < 24.0; particle += 1.0)
	{
		float particleDist = cos(particle * sin(particle * seed) * seed);
		
		vec2 particpos = (point * frame) * particleDist;
		
		float particleDistance = dot(particpos - uv, particpos - uv);
		
		if (particleDistance < particleSize)
		{
			float fade = (particle / 24.0) * frame;
			
			renderedColour = mix((explosionColour / fade), renderedColour, smoothstep(0.0, size * 2.0, particleDistance));
		}
		
		point = point * rr;
	}
	
	renderedColour *= smoothstep(0.0, 1.0, (1.0 - frame) / 1.0);
	
	return renderedColour;
}


void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	uv = 1.0 - (2.0 * uv);
	
	if (resolution.x > resolution.y)
		uv.x *= (resolution.x / resolution.y);
	else
		uv.y *= (resolution.y / resolution.x);	
	
	vec3 col = DrawExplosion(uv, vec3(0.5, 0.3, 0.8), mod(time, 1.0), 0.00025, 1.0);

	gl_FragColor = vec4(col, 1.0);
}
