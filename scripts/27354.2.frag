#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 5.0 - 1.0;
	vec4 c = vec4(1.0,0.5,0.1,1.0)*uv.y*mod(time,1.0)*50.;
	if (c.r > 0.9) {
		c = vec4(0.0);
	}
	c += vec4(uv.x,uv.y, mod(time,1.0), 1.0);
	vec4 d = vec4(0.3,0.2,0.5,1.0)*uv.x-0.3*mod(time,1.0)*50.;
	c *= mod(d, c.x);
	gl_FragColor = c;
}