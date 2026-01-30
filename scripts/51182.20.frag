#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define speed 4.
#define freq 4.
#define amp 0.25
#define phase 0.0


void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5; 
	p.x *= resolution.x / resolution.y; 
	p.x += sin(p.y * 60. - 10.4* time) * cos(p.x * 100.) * 0.05;
	float sx = (amp) * sin(2.0 * 3.141593 * (freq) * p.x - (speed)*time);
	float lw = 0.4; 
	float dy = abs(p.y - sx);
	float lc  = lw / 2. / dy;
	//lc += 0.8 * abs(cos(20. * dy - 10. * time));
	gl_FragColor = vec4(lc * (0.5 + p.x), lc * 0.2, 0., 1.0);
}