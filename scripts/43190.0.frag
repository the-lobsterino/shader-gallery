// from http://glslsandbox.com/e#43183.1
//
// added moving mouth

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	// Transform fragcoord to viewport coord.
	vec2 coord = (gl_FragCoord.xy + gl_FragCoord.xy - resolution) / resolution.y;	
	
	// Get the radius from the length of the coordinates
	float radius = length(coord);
	
	// Paint if the fragment its inside the radius and outside the mouth
	gl_FragColor = vec4(1.0,1.0,0.0,1.0) 
			* step(radius, .5) 
			* step(coord.x / radius, .199*sin(time*6.)+.8);	

}