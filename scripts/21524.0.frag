#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	float p = mouse.x*2.1;
	float f= step(sin(50.0*(position.x))+1.0,p);	
	float k = sin(position.x*10.0-time) - sin(time*position.y);
	if (f>k)
	
	gl_FragColor = vec4(k,.0,f, 1.0 );

}