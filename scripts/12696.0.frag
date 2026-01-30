#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float aspect = resolution.x/resolution.y;
	vec2 p = (gl_FragCoord.xy / resolution.y) - .5*vec2(aspect,1);

	vec3 c = vec3(0.);
	
	if (length(p)<.5) c = vec3(1.);	

	gl_FragColor = vec4(c,1);

}
