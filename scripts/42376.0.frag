#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 center = resolution.xy / 2.0;
	
	vec2 position = (gl_FragCoord.xy - center) / resolution.y;
	
	float distance_to_center = sqrt(position.x*position.x + position.y*position.y);
	
	float radius = 0.0;
	//radius *= (1.0 - cos(time * 3.14159265359)) * 0.5;
	
	float inner_circle = max(0.0, distance_to_center - radius);
	float outer_circle = min( 1.0, log(inner_circle*10.0)*1.5 );
	
	float flux = ( 1.0 - cos(time * 3.14159265359) ) * 0.5;
	//float flux = 1.0;
	
	float outer_circle_flux =  outer_circle;
	
	gl_FragColor = vec4(outer_circle_flux * 0.5, 0.0, 0.0, 1.0);
}