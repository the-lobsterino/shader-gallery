#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float dist = .1;
	float radius = .2;
	
	vec3 Color = vec3(0.8, 0.693, 0.695);
	float col = -0.3;
	vec2 centr = 2.0 * (gl_FragCoord.xy * 2.0 - resolution) /
		min(resolution.x, resolution.y);
	
	for(float i = 0.0; i < 50.0; i++)
	{
	  float si = sin(time + i * dist) / 0.5;
	  float co = cos(time + i * dist) * 0.5;
		
	  col += 0.0032469 / abs(length(centr + vec2(si , co * si )) - radius);
	}

	
	gl_FragColor = vec4(vec3(Color * col), 10.0);
}