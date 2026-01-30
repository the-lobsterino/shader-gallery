// 26/JUN/2019 (2)

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec4 Particle(vec2 uv, float particle, vec4 renderColour, vec4 startParticleColour, vec4 endParticleColour, vec2 startPosition, vec2 endPosition, float frame, float size)
{
	vec2 diff = endPosition - startPosition;
	
	vec2 position = startPosition + (diff * frame);
		
	float particleDistance = dot(position - uv, position - uv);

	if (particleDistance < size)
	{
		float fade = (1.0 - frame);
		
		vec4 particleColour = mix(startParticleColour, endParticleColour, frame) * (sin(frame * 50.0 + particle) + 2.0);
		
		renderColour = mix((particleColour * fade), renderColour, smoothstep(0.0, size, particleDistance));
	}

	return renderColour;
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	if (resolution.x > resolution.y)
	{
		uv.x *= (resolution.x / resolution.y);
	}
	else
	{
		uv.y *= (resolution.y / resolution.x);
	}

	float t = time;
	
	vec4 renderColour = vec4(0.0);
	
	float size = (0.0010 * 1.0);
	
	vec4 colourStart = vec4(1.0, 0.5, 0.04, 1.0);
	vec4 colourEnd   = vec4(0.8, 0.3, 0.02, 1.0);
	
	vec2 startPosition = vec2(0.5);
			
	renderColour = Particle(uv, 1.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.602042903007028, 0.836336475720786), mod(t, 1.0), size);
	renderColour = Particle(uv, 2.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.871566897664018, 0.654528960424722), mod(t, 1.0), size);
	renderColour = Particle(uv, 3.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.884303139934457, 0.653930521874656), mod(t, 1.0), size);
	renderColour = Particle(uv, 4.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.624649482138757, 0.522841540408713), mod(t, 1.0), size);
	renderColour = Particle(uv, 5.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.75335375860024,  0.70021467176276),  mod(t, 1.0), size);
	renderColour = Particle(uv, 6.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.402262688801746, 0.879384072441321), mod(t, 1.0), size);
	renderColour = Particle(uv, 7.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.72595403377244,  0.717507299835564), mod(t, 1.0), size);
	renderColour = Particle(uv, 8.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.451927669091116, 0.21709233066863),  mod(t, 1.0), size);
	renderColour = Particle(uv, 9.0,  renderColour, colourStart, colourEnd, startPosition, vec2(0.710750730573549, 0.710151347662393), mod(t, 1.0), size);
	renderColour = Particle(uv, 10.0, renderColour, colourStart, colourEnd, startPosition, vec2(0.49366962280761,  0.107259838426141), mod(t, 1.0), size);
	renderColour = Particle(uv, 11.0, renderColour, colourStart, colourEnd, startPosition, vec2(0.328986461427522, 0.882521700990629), mod(t, 1.0), size);
	renderColour = Particle(uv, 12.0, renderColour, colourStart, colourEnd, startPosition, vec2(0.591411060929024, 0.522236720436363), mod(t, 1.0), size);
	renderColour = Particle(uv, 13.0, renderColour, colourStart, colourEnd, startPosition, vec2(0.343995751041917, 0.49218477937029),  mod(t, 1.0), size);
	renderColour = Particle(uv, 14.0, renderColour, colourStart, colourEnd, startPosition, vec2(0.732796941293775, 0.860774436435092), mod(t, 1.0), size);
	renderColour = Particle(uv, 15.0, renderColour, colourStart, colourEnd, startPosition, vec2(0.14398980473354,  0.158763632717898), mod(t, 1.0), size);
	renderColour = Particle(uv, 16.0, renderColour, colourStart, colourEnd, startPosition, vec2(0.448895202227354, 0.200505678635326), mod(t, 1.0), size);

	gl_FragColor = renderColour;
}
