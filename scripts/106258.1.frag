//  @dennishjorth on twitter just to learn my son Jonas a little about fractals, complex numbers and general integer series.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iters = 200;

int fractal(vec2 p) {
  
	float tt = time*0.003;
	float tt2 = time*0.07;
	float cr = cos(tt+10.0*sin(tt2*0.09));
	float ci = 0.75+sin(tt+cos(tt2*0.035))*0.15;
	
	for (int i = 0; i < iters; i++) {
		
		if (length(p) > 1.5) {
			return i;
		}
		p = vec2(p.x * p.x - p.y * p.y + cr, 2.0 * p.x * p.y + ci);
		
	}
	
	return 0;	
}

vec3 color(int i) {
	float f = float(i)/float(iters) * 2.0;
	return vec3((sin(f*10.0)), (sin(f*24.0)), abs(sin(f*42.0)));
}

void main( void ) {

	vec2 position = 3.*(-0.5 + gl_FragCoord.xy / resolution.xy );// + mouse / 1.0;
	position.x *= resolution.x/resolution.y;
	vec3 c = color(fractal(position));
	
	gl_FragColor = vec4( c , 1.0 );

}
