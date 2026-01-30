#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 mulC(vec2 a,vec2 b) {
	return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
vec2 conj(vec2 a) { return vec2(a.x,-a.y); }
float norm2(vec2 a) { return length(a); }

int mandel(vec2 x0) {
	vec2 x = x0;
	const int max_iter = 30;
	for(int i=0;i<max_iter;++i) {
		x=mulC(x,x)+x0;
		if(norm2(x)>2.) {
			return i;
		}
	}
	return max_iter;
}


void main( void ) {
	vec2 position = ((gl_FragCoord.xy / max(resolution.x,resolution.y))-.5)*3.;

	float color = float(mandel(position)) / 30.;
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}