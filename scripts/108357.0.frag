#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy )*156.0;
	pos -= 115.0;
	
	float color = 1.5;
	float dist=sqrt(pos.x*pos.x+pos.y*pos.y);
	color -= cos(dist-time*10.56);
	gl_FragColor = vec4( vec3( color*(56.0-dist)/dist/1.0, color , 0.5), 12.0 );

}