#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	position = gl_FragCoord.xy / resolution.xy;
	float distance = length(mouse - position);

	float r = 0.7 + sin(time)*0.5;
	float g = 0.8 + cos(time)*0.5;
	float b = 0.5 + cos(time)*0.5 + sin(time)*0.5;
	float radius = 0.3;
	
	if (distance < radius ) {
		r += (radius - distance);
		g += (radius - distance);
		b += (radius - distance);
	}
	
	r -= position.x;
	b -= position.y;
	g -= position.y;

	gl_FragColor = vec4(r, g, b, 1.0 );

}