#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	// color
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	// aspect
	float a = resolution.x / resolution.y;
	
	// position
	vec2 position = ( gl_FragCoord.xy / resolution - 0.5 ) * 2.0;
	position.x *= a;
	
	color.xy = position;

	gl_FragColor = vec4(color, 1.0 );
}