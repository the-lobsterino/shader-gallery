#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x  * 80.0 ) + cos( position.y * 19.0 );
	
	
	float per=fract(time);
	float parm;
	if (per<0.5)
	
		parm =  pow(.002,per);
	
	else 
	 parm =	pow(.002,1.0-per);
	gl_FragColor = vec4( vec3( color *(.03/parm), color * 0.4*parm,  0.0 ), 1.0 );
}