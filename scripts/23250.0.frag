//Galaxy Collision
//By nikoclass
//Modifications by BackwardSpy

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iters = 200;

int fractal(vec2 p) {
	vec2 so = (-1.0 + 2.0 * mouse) * 0.4;
	vec2 seed = vec2(0.098386255 + so.x, 0.6387662 + so.y);
	
	for (int i = 0; i < iters; i++) {
		
		if (length(p) > 2.0) {
			return i;
		}
		p = vec2(p.x * p.x - p.y * p.y + seed.x, 2.0* p.x * p.y + seed.y);
		
	}
	
	return 0;	
}

vec3 color(int i) {
	float f = float(i)/float(iters) * 2.0;
	f=f*f*2.;
	//return vec3(f,f,f);
	return vec3((sin(f*2.0)), (sin(f*3.0)), abs(sin(f*7.0)));
}

float rand(vec2 p) {
	return fract(sin(p.x * 3274623.2342 + p.y * 2382847.23));
}
void main( void ) {

	vec2 position = 2.5 * (-0.5 + gl_FragCoord.xy / resolution.xy );// + mouse / 1.0;
	position.x *= resolution.x/resolution.y;
	vec3 c = color(fractal(position));
	
	gl_FragColor = vec4( c , 1.0 );


}