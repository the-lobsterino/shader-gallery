#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = (position-vec2(0.5))*2.0;
	position.x *= resolution.x/resolution.y;

	vec3 color = vec3(0.0);
	
	vec2 p = position*16.0 + vec2(sin(sin(time) + time), sin(sin(time*1.1) + time*1.2));
	for (int i=0; i<32; i++)
	{
		color += length(p) * vec3(sin(p + time), p);
		p.x = sin(p.x);
		p.y = sin(p.y);
	}
	
	color = log(color)/4.0;
	

	gl_FragColor = vec4( color, 1.0 );

}