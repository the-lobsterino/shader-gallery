#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0, r ,g ,b;
	float x = position.x;
	float y = position.y;

	g = .1/cos((x*32.+(time/50.)*100.));
	g += .1/cos((y*32.+(time/50.)*100.));
	g -= .3;
	g += sin(x*30.)*.3;
	
		
	gl_FragColor = vec4(r,g,b,1 );

}