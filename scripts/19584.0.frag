#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 center = resolution.xy / vec2(2,2);
	vec2 texCoord = gl_FragCoord.xy;
	
	float pi = 3.14159;
	float normX = gl_FragCoord.x / resolution.x;
	float normY = gl_FragCoord.y / resolution.y;


	
	float centerBar = abs((1. - (length(texCoord.y - center) / resolution.y)* 2.));
	float horBars = 1. - abs(cos(pi * normY));
	float vertBars = 1. - abs(cos(5. * pi * normX));
	float movingVertBars = (1. - abs(cos(5. * pi * normX + time))) - abs(cos(pi * normY));
	
	
	
	float r = movingVertBars;
	float g = 0.;
	float b = 0.;
	float a = 1.;
	
	
	gl_FragColor = vec4(r,g,b,a);

}