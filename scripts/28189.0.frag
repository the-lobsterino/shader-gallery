#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
	pos += length(mouse-.5)*3.*vec2(cos(1.1001234567890e3*time+gl_FragCoord.x), sin(1e3*time+gl_FragCoord.y))/resolution;
        float horizon = 0.0; 
        float fov = 0.8; 
	float scaling = 1.0;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	
	//checkboard texture
	float color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));	
	//fading
	color *= p.z*p.z*10.0;
	
	gl_FragColor = vec4( vec3(color), 1.0 );
	
	gl_FragColor += 0.99*(texture2D(backbuffer, gl_FragCoord.xy/resolution) - gl_FragColor);

}