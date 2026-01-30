#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 0.1;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
		
	float run=time*9999.2;
	if (pos.y>1.0)	
	  run=-run;
				
	float color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y-run, 0.1) - 0.05));		
	
	//fading
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}