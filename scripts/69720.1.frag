#ifdef GL_ES
precision mediump float;
#endif

#define _ if(p.y < -.5){p -= sign(p)/2.;} p *= 2.;

varying vec2 surfacePosition;

void main( void ) 
{
	vec2 p = surfacePosition-vec2(0.,.5);
		
		_
	       _ _
	      _ _ _
	     _ _ _ _
	
	
	gl_FragColor = vec4(dot(p,p) < .25);
}