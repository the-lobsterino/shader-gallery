#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
float tex(vec2 p) {
	p = mod(p * 15.0, 2.0) - 1.0;
	return 1.0 - dot(p,p);
}

void main( void ) {
	vec2 p = -1.0 + 2.0 *( gl_FragCoord.xy / resolution.xy );
	gl_FragColor = vec4(tex(vec2(p.x / abs(p.y) + time, p.y) )) * abs(p.y *p.y* p.y);
}