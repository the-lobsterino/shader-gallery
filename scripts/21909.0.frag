#ifdef GL_ES
precision mediump float;
#endif

//uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position -= 0.5;
	position.x *= resolution.x/resolution.y;

	// here's how a^2+b^2=c^2 can be used to create circles
	float c = sqrt(position.x*position.x+position.y*position.y);
	
	gl_FragColor = vec4(vec3(1.0 - c*2.0), 0.7 );

}