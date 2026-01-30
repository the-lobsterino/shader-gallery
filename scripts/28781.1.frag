#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// better code to look around.  --joltz0r

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 0.1;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);
        // normalize mouse to -2..+2
	vec2 m = (mouse - 0.5) * 4.0;

	p.z += m.y;
	// rotate x*z with mouse.xy in matrix as follows
	p *= mat3(cos(m.x), -sin(m.x),  0.0,
		  sin(m.x),  cos(m.x),  0.0,
		       0.0,       0.0,  1.0
		  );

	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	//checkboard texture
	vec3 color = vec3((sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05)) + 1.0)/2.0);	
	//fading
	vec3 light = vec3(length(p.zz*0.5));
	

	gl_FragColor = vec4( color * light, 1.0 );

}