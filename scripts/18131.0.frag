#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Removed if's and made it antialiased(ish)
// DH

void main( void )
{
	vec2 position = gl_FragCoord.xy / resolution.xy;
	position = 2.*position - 1.;
	position.x *= resolution.x/resolution.y;
	vec2 delta    = position;
	vec2 norm     = normalize(delta);
	
	float s = abs(sin(atan(norm.x, norm.y) *10. + time)) * .8;

	gl_FragColor = vec4(position * 0.4, 0.0, 1.0);
	gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 0.1, 1.0) * 0.95, smoothstep(.26+s, .1+s, dot(delta, delta)));
	gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 1.0, 1.0) * 0.95, smoothstep(.35, .3, length(delta)));
}