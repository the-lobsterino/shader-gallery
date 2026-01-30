#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy);

	
	float x = position.x + sin(position.y * 7.0 + time * 2.0) * 25.5;
	float y = position.y + cos(position.x * 7.0 + time * 2.0) * 25.5;

	
	float colorX = floor(mod(((gl_FragCoord.x + x / 2.2) / 50.0), 2.0));
	float colorY = floor((mod(((gl_FragCoord.y + y / 2.2) / 50.0) + y * 0.0, 2.0) / 1.0 ) );
	
	float colorX1 = floor(mod(((gl_FragCoord.x + 50.0 + x / 2.2) / 50.0), 2.0));
	float colorY2 = floor((mod((((gl_FragCoord.y + y / 2.2) + 50.0) / 50.0) + y * 0.0, 2.0) / 1.0 ) );
	
	float squares1 = (colorX * colorY);
	float squares2 = (colorX1 * colorY2);
	
	float color = squares1 + squares2;	

	gl_FragColor = vec4( vec3(color, color, color), 1.0 );

}