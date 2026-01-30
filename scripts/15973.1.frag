#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = gl_FragCoord.xy/resolution.y;
	
	vec2 p1 = vec2(0.2*1.77, 0.2);
	vec2 p2 = vec2(0.6*1.77, 0.6);
	
	float slope = (p2.y - p1.y)/ (p2.x - p1.x);
	float interceptTemp = (p1.y * p2.x) - (p2.y * p1.x);
	float intercept = interceptTemp / (p2.x - p1.x);
	
	float distTemp = abs(slope*pos.x - pos.y + intercept);
	float dist = distTemp/sqrt(slope*slope + 1.0);
	
	float val = sin(dist)*sin(dist);
	float color = 1.0 / (dist*20.0);
	
	gl_FragColor = vec4(0.5,0.6,1.0,1.0)*vec4(color,color,color,1.0);
	
	/*
	if(dist < 0.1)
	{
		if(dist < 0.04)
			gl_FragColor = vec4(cos(100.0*dist),cos(100.0*dist),cos(100.0*dist),1);
		else
		{
			vec3 col = vec3(0,0,cos(20.0*dist));
			gl_FragColor = vec4( col,1);
		}
	}
	else
		gl_FragColor = vec4(0,0,0,1);	 
	*/
}
