#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Mahmud Yuldashev 050415

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 col;
	
	vec2 q=p-.5;
	
	float l=abs(q.x/q.y)/.6;
	
	vec3 bg = vec3(1.,.1,2.);
	
	col+=smoothstep(.1,1.,pow(l,.3));
	
	col=bg/col;

	

	gl_FragColor = vec4(col, 1.0 );

}