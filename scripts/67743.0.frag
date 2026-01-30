precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main (void) 
        {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 0.40;
	vec3 p = vec3(pos.x, fov, pos.y - horizon);  
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	s.x = s.x - time*0.01;
	//checkboard texture
	float c= sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));	
	//fading
	c *= p.z*p.z*20.0;
	(pos.y<=-0.0) ? gl_FragColor = vec4( vec3(c,c,c), 1.0) : gl_FragColor = vec4( vec3(c,c,c), 1.0);	
        }