#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	p *= 7.0;
	
	float color = 9.0;
	
	if(-3.0+p.x>tan( p.y+time*1.8)*.4*sin(time*3.)*.8 && (-5.0+p.x<tan( p.y +time*1.8)*.4*sin(time*3.)*.8))
	gl_FragColor =  vec4( vec3( pow(p.y,1.), p.y, p.x+sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	 
	else

	gl_FragColor = vec4( vec3( cos(time),  1.4, 9.8 ), 11.0 );

}