#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = (gl_FragCoord.xy / resolution.xy) - vec2(0.5);	
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 0.1;
	float size = 0.1;

	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x / p.z, p.y / p.z) * scaling;
	
	// checkboard texture
	float intensity = sign((mod(s.x, size) - size / 2.0) * (mod(s.y, size) - size / 2.0));	
	
	// fading
	intensity *= p.z * p.z * 10.0;
	vec3 color = vec3(intensity, intensity, intensity);
	
	gl_FragColor = vec4(color, 1.0);

}