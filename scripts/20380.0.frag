#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.1415926535;
float slow = 4.0;
float zoom = 2.0;
float cr = 0.1;
const int numIter = 10;
void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
	float tm = mod(time/slow, zoom);
	float c = cos(tm*pi);
	float s = sin(tm*pi);
	vec2 pt = vec2(c, s) + p*zoom;
	for(int i = 0; i < numIter; i ++) {
		pt = vec2(pt.x*pt.x - c*pt.y*pt.y, tm*pt.x*pt.y) + pt;
	}
	float ss = smoothstep(cr, cr - 0.01, length(pt));
	vec3 col = vec3(pt.x, pt.y, ss);
	gl_FragColor = vec4(col, 1.0);
}