#ifdef GL_ES
precision mediump float;
#endif
varying vec2 surfacePosition;
uniform float time;
uniform vec2 resolution;
uniform sampler2D bk;
const int iters = 7;
int fractal(vec2 p, vec2 pos) {
	vec2 so = (-1.0 + 2.0 * pos) * 0.4;
	vec2 seed = vec2(0.098386255 + so.x, 0.6387662 + so.y);
	int breakPt = int(pow(fract(length(p)+length(pow(p, pos*cos(time+p.x+p.y)))+time/10.), .44)*float(iters));
	for (int i = 0; i < iters; i++) {
		if(i > breakPt) break;
		if (length(p) > 2.0) return i;
		vec2 r = p;
		p = vec2(p.x * p.x - p.y * p.y, 2.0* p.x * p.y );
		p = vec2(p.x * r.x - p.y * r.y + seed.x, r.x * p.y + p.x * r.y + seed.y);
	}
	
	return 0;	
}
vec3 color(int i) {
	return .333*vec3(3,5,7)*float(i)/float(iters);
}
void main( void ) {
	gl_FragColor = 0.05*vec4( color(fractal(surfacePosition*3., vec2(0.0072, 0.575))) , 1.0 );
	vec2 deltaRNG = (8./(1.+7.*length(gl_FragColor)))*(vec2(cos(time/7.-4.*length(surfacePosition)), sin(time/7.1+5.*length(surfacePosition))));
	gl_FragColor += 0.96*texture2D(bk, (deltaRNG+gl_FragCoord.xy)/resolution);
}