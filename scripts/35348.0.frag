#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*2.0-1.0;
	
	position.x *= resolution.x/resolution.y;

	vec3 color = vec3(0.0);
	
	vec2 p = position*16.0 + vec2(sin(cos(time)*3.14 + time), cos(sin(time*1.1)*3.14 + time*1.2));
	for (int i=0; i<16; i++)
	{
		color += length(p) * abs(vec3(sin(p.x + time*1.13231),cos(p.y + time*1.12), sin(p)));
		p.x = sin(p.x);
		p.y = cos(p.y);
	}
	
	color = 1./log(color+1.);
	

	gl_FragColor = vec4( color, 1.0 );

}