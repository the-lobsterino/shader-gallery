#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
const float spd=1.0;
const float bar=1.0;

float hf( float h )
{
	// Uncommening the following fixes the shader for an unknown reason.
	// return h;
	 return clamp((abs(fract(h*bar) * 6. -3.) -1.0), 0.0, 1.0);
	 
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	vec3 color1 = vec3(hf(p.y+time/spd), hf((p.y+.33)+time/spd), hf((p.y+.66)+time/spd));
	
	vec3 color = color1;
	
	gl_FragColor = vec4(color, 1.0);
}