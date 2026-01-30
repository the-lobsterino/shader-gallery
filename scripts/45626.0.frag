#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = -2.0*mouse.y+1.0; 
        float fov = 0.5; 
	float scaling = 0.5;
	float rot = mouse.x * 3.14;
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	s = vec2(s.x*cos(rot) - s.y*sin(rot),s.y*cos(rot)+s.x*sin(rot));
	float f = 1.0;
	
	//checkboard texture
	float color = sign((mod(s.x*f, 0.1*f) - 0.05) * (mod(s.y*f, 0.1*f) - 0.05));	
	
	//fading
	color *= p.z*p.z*10.0;
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}