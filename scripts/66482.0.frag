#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Optimized version (logos7@o2.pl) - only one sqrt

vec2 hash2(vec2 uv) {
	return fract(sin(mat2(15.23, 35.48, 74.26, 159.37) * uv) * 47658.23);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x *= resolution.x / resolution.y;
	uv-=  0.5;
	uv *= sin(length(uv)*32.-time*16.)/pow(1.+length(uv),4.)+16.;
	
	vec2 g = floor(uv);
	vec2 f = fract(uv);
	float d = 1.0;
	for(int i = -1; i <= 1; i++) {
		for(int j = -1; j <= 1; j++) {
			vec2 b = vec2(i, j);
			vec2 v = b + hash2(g + b) - f;
			d = min(d, dot(v,v)+cos(time)/200.0); // old: d = min(d, length(v));
		}
	}
	
	float c = sqrt(d); // old: float c = d;
	c = 0.1/c;

	gl_FragColor = vec4( c*1.5+cos(time)/2.0, c*.8+sin(time)/2.0, c*0.7, 1.0 );

}