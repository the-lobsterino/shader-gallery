// Rolf Fleckenstein

#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	float speed = 1.0;
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = -mouse.y*2. + 1.0; 
        float fov = 0.33; 
	float scaling = 0.1;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	
	float angle = -mouse.x * 6.66;
	float sx = s.x;
	float sy = s.y;
	float ssy = s.y;
	s.x = sx*cos(angle) - sy*sin(angle);
	s.y = sx*sin(angle) + sy*cos(angle);
	float color;
	speed /= 10.;
	//checkboard texture
	if (ssy < 0.0) 
	    color = sign((mod(s.x+speed*time, 0.1) - 0.05) * (mod(s.y+speed*time, 0.1) - 0.05));	
	if (ssy > 0.0) 
	    color = sign((mod(s.x+speed*-time, 0.1) - 0.05) * (mod(s.y+speed*-time, 0.1) - 0.05));	
	//fading
	color *= p.z*p.z*15.0;
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}