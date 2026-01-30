#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.1; 
        float fov = 1.0; 
	float scaling = 0.01;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon + 0.0);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling * time;
	
	//checkboard texture
	float color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));	
	//fading
	color *= p.z*p.z*10.0;
	color = max(0.0, color);
	
	gl_FragColor = vec4( vec3(color / (color + 1.0)), 1.0 );

}