#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	p *= 8.0;
	
	float color = 0.0;
	
	if(-3.0+p.x>tan( p.y+time*1.8)*.4*sin(time*3.)*.8 && (-5.0+p.x<tan( p.y +time*1.8)*.4*sin(time*3.)*.8))
	gl_FragColor =  vec4( vec3( pow(p.y,7.), p.y, p.x+sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	 
	else

	gl_FragColor = vec4( vec3( cos(time),  0.4, 0.8 ), 1.0 );

}