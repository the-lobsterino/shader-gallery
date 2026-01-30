#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.0; 
        float fov = 1.0; 
	float scaling = 0.05;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	p.z = abs(p.z + .004*sin(10.0*time));
	vec2 s = vec2(p.x/p.z+.2*sin(time), p.y/p.z+time*1.4) * scaling;
	
	
	//checkboard texture
	float color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));	
	//fading
	color *= p.z*p.z*10.0;
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}