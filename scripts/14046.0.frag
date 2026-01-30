#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float blob(vec2 c, float r1, float r2){
	return 	1.-smoothstep(r1,r2,distance(c,gl_FragCoord.xy));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	
	float b = blob(mouse*resolution,100.,150.) + blob(vec2(150.,150.),100.,150.);
	
	
	gl_FragColor = vec4(vec3(step(0.5,b)),1.0);

}