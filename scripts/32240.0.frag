#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );



	float color = 0.0;
	float r,g,b;
	r=g=b=0.0;
	

	r = sin(time*1.3+position.x*12.0+cos(time*2.5+position.x*12.0+position.y*21.0+cos(time*2.8+position.x*12.0+position.y*19.0)));
	g = sin(time*2.5+position.y*17.0+cos(time*0.7+position.x*10.0+position.y*12.0+cos(time*3.7+position.x*16.0+position.y*12.0)));
	b = 0.6;sin(time*1.2+position.x*15.0+cos(time*3.8+position.x*16.0+position.y*15.0+cos(time*3.4+position.y*16.0-position.x*12.0)));
	
	gl_FragColor = vec4( vec3( r,g,b ), 0.1 );
	
		
	
}