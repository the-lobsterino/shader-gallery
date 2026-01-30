// Necips effect

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float f = abs(sin(0.1*time));
	float color = 0.; 
	for (float i=0.1; i<=9.; i+=0.1) 
     	{
		color += sin( f*i*time*position.x ) + sin( f*i*time*position. y);
     	}
	gl_FragColor = vec4( vec3( color), 1.0 );

}