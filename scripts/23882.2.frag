#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// Mahmud Yuldashev My first Noise function mahmud9935@gmail.com


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy-mouse ) ;

	vec3 col;
	
	//float q;
	
	//col.r=p.x;
	//col.g=p.y;
	//col.b=p.y;
	
	float q=fract(tan(p.x+p.y*1000.)*1000.);
	col=vec3(q);

	gl_FragColor = vec4( col, 1.0 );

}