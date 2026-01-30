#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 9.0; 
        float fov = 1.5; 
	float scaling = 0.;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
		
	float run=time*1.9;
	if (pos.y>1.0)	
	  run=-run;
				
	float color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y-run, 0.1) - 0.05));		
	
	//fading
	color *= p.z*p.z*200.0;
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}