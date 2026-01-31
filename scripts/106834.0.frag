#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
	vec3 c = vec3(0.005, 0.0021, 0.009); // BG color
	vec3 lightCol = vec3(0.1 + 0.09, 0.23, 0.6 + 0.04 * tan (time * 3.));
    
	for(int i = 0; i <20; ++i) {
        	float t = 0.8 * 3.14 * float(i) / 5. * fract(time * .5);
        	float x = cos(t);
        	float y = sin(t);
        	vec2 o = .5 * vec2(x  * fract(time * .5) -  y, y);
        	c += 0.02 / (length(p - o)) * lightCol * 6.;
	}
	gl_FragColor = vec4(c,1.);
}