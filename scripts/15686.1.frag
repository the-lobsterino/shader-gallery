#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

	void dot( vec2 dotpos, vec4 color, vec2 position )
	{
		vec2 delta = vec2(position.x-dotpos.x,position.y-dotpos.y);
		delta *= delta;
		float distance = sqrt(delta.x+delta.y );
		float colorfactor = 1.0-pow(distance*10.,0.5);
		gl_FragColor += color * colorfactor;
	}
	
	void main( void ) {
	
		vec2 position = ( gl_FragCoord.xy / resolution.xy );
		float color = 0.0;
		
		vec2 point = vec2( sin(time), -cos(time) );
		point *= .1;
		point += 0.5;
		
		vec2 delta = position-point;
		vec2 squared = delta*delta;
		float distance = sqrt(squared.x+squared.y);
		
		
		if ( distance < 0.01)
			color = 0.7;
		color=1.0-pow(distance*5.,0.5);
	
		gl_FragColor = vec4( vec3( color ), 1.0 );
		
		dot( vec2(sin( time*2. ),cos(time*2.))/10. +vec2(0.55,0.45), 
		    vec4(.5,.5,1.,1.), position );
		dot( vec2(sin( .5+time*2. ),cos(.7+time*2.))/10. +vec2(0.45,0.55), 
		    vec4(1.0,.5,1.5,1.), position );
		
		
}