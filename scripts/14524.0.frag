#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D u_texture;

void main(void)
{
	vec2 vv = gl_FragCoord.xy; 
	vv.x += sin( time * 2.0 ) * 40.0;
	vv.y += cos( time * 2.3 ) * 30.0;
	vv -= resolution.xy / 2.0;
	// smoothstep to produce an aliasing-free edge around 0
	float fac = smoothstep(-.05, .05, sin( atan( vv.y, vv.x ) * 10.0 - time * 10.0 + length(vv) / 10.0 ));
	vec4 color = mix(vec4( 1., .0, 0., 1.0 ), vec4( .0, .0, 1., 1.0 ), fac);
	color.xyz *= length(vv) / (length(resolution.xy)/2.0);
	
	gl_FragColor = color;
}