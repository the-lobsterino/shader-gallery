// Visual stim : rotating dot 
// JH@KrappLab
// 2016-06-21
// http://glslsandbox.com/


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

uniform vec2 traj;


void main( void ) {
	
	
	
	float rps = 1.0 ;
	float dotdiameter = 10.0 ;
	float trajdiameter = 10.0 ;
	
	
	
	gl_FragColor = vec4(0.,0.,0.,0.);
	vec2 traj = vec2( trajdiameter*cos(time*(-3.1415) * (rps*1.0)) , trajdiameter*sin(time*(-1.1415) * (rps*2.0)) ) + resolution*mat2(0.5,0,0,0.5) ;
	
	
	// sync signal
	if ( traj.y >= resolution.y*.5+115.)
	{
		if (distance(gl_FragCoord.xy, vec2(0.)) < 20.)
		{
			gl_FragColor = vec4(1.,1.,1.,1.);
		}
	}
	else
	{
		gl_FragColor = vec4(0.,0.,0.,1.);
	}
	
	// stim signal
	if (distance(gl_FragCoord.xy, traj) < dotdiameter)
	{
		gl_FragColor = vec4((0.5 + 0.5*(cos(0.2*time))),(0.5 + 0.5*(sin(0.5*time))),(0.5 + 0.5*(cos(0.15*time)*sin(0.7*time))),1.);
	}
	

}