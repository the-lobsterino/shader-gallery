#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main(void)
{
	vec2 vv = gl_FragCoord.xy - mouse.xy; 
	vv.x += sin( time * 1.0 ) * .1;
	vv.y += cos( time * 1.3 ) * .1;
	
	vv -= resolution.xy / 2.0;
	vec4 color = vec4( 1, 1, 1, 1.0 );
	if ( sin( atan( vv.x, vv.y ) * 2.0 - time * 20.0 + length(vv) / 10.0 ) > 0.0 )
		color = vec4( 0., .0, 0., 1.0 );
	color.xyz *= length(vv) *2. / (length(resolution.xy));
	gl_FragColor = color;
}