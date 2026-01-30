#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;


vec3 grid(vec3 colour, float linesize, float xc, float yc){
	float xmod = mod(position.x, xc);
	float ymod = mod(position.y, yc);
	return xmod < linesize || ymod < linesize ? vec3(0) : colour;
}


void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.25;
	
	vec3 color = vec3(0.0);
	
	color += grid(vec3(1), 0.001, 0.06, 0.06);
	gl_FragColor = vec4(color, 1.0 );

}