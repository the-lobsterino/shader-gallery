#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.1,0.4);	
	float t = time*0.2;
        float horizon = -0.0; 
        float fov = 1.0; 
	float scaling = 0.1;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	
	float c = 0.0;
	
	if(pos.y<-0.1){
	if (pos.y > 0.) c  = sign((mod(s.x, 0.05) - 0.05) * (mod(s.y+t, 0.1) - 0.04));else 	c = sign((mod(s.x, 0.05) - 0.05) * (mod(s.y-t, 0.1) - 0.04));
	//c *= p.z*p.z*5.0;
	}
	gl_FragColor = vec4( vec3(c*0.8,c*0.8,c*0.2), 1.0 );

}