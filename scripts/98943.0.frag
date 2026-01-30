#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//_____________________________________
// A M I G A
// SPEEDHEAD OF BYTERAPERS
//_____________________________________
void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5);	
        float fov = 2.; 
	float scaling = 4.;
	
	vec3 p = vec3(pos.x - ( 0.05), fov, pos.y -  ( 0.20));
	vec2 s = vec2(p.x / p.z, p.y / p.z) * scaling;
	s.x-=time;
	
	//checkboard texture
	float color = sign((mod(s.x, 1.) - 0.5) * (mod(abs(s.y)+1., 1.) - 0.5));	
	//fading
	color = max(-2.0, color * pow(p.z, 2.0) * 4.0);
	if (s.y <1.5)	gl_FragColor= vec4(color);
}
