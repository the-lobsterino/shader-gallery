//LOOK INTO THE EYE!

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfacePosition;

#define eyer 0.8

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - (resolution/2.)) / min(resolution.x,resolution.y) );
	
	
	if(!(distance(position,vec2(0,0.5)) < eyer && distance(position,vec2(0,-0.5)) < eyer)){
		vec2 position = ( gl_FragCoord.xy / resolution.x );
		float ang = atan(position.x-0.5,0.25-position.y);
		float len = length(position.x-vec2(0.5,0.25));
		float color = len*16.0+sin(ang*20.0);
		gl_FragColor = vec4( vec3( 0.5+0.5*sin(color+time),0.5+0.5*cos(color+time),0.5+0.5*sin(color+time+3.1415)), 1.0 );
		return;
	}
	
	vec2 truepos = position;
	
	float r = length(position);
	float theta = atan(position.y,position.x);
	
	position = vec2(r*cos(theta+10.*r*cos(time)),
		 r*sin(theta+10.*r*sin(time)));
	
	
	position *= 120.0;
	position += mouse / 10.0;

	
	float color = ( position.x * position.x + position.y * position.y );
	
	if(length(truepos-0.5*(mouse-vec2(0.5)))>eyer/2.5){
		color = 0.0001*color;
	}
	if(length(truepos-0.7*(mouse-vec2(0.5)))<eyer/(8.+2.*cos(0.3*time))){
		color = -0.1*color;
	}
	
	gl_FragColor = vec4( vec3( sin( color + time ), sin( color + 2.0 * time ), sin( color + 3.0 * time ) ), 1.0 );


}