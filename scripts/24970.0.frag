#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 position = (2.*gl_FragCoord.xy - resolution.xy) / max(resolution.y, resolution.x);
	
	float x = position.x;
	float y = position.y;
	float u,t;
	float iv = 60.;
	
	for(int i=0; i<15; i++) {
		u =  -x*x*y*y - 2.*x*x+.92 - sin(time*4.)/4.+.1;
		t =  -y*y*x*x - 2.*y*y+.92 - cos(time*3.)/4.+.1;
		
		x = u; y = t;
		if(u*u+t*t > 2.) {
			iv = float(i);
			break;
		}
		
	}
	
	vec3 color =  vec3(iv/10.);
	gl_FragColor = vec4(color.r*sin(time*2.)*sin(time*2.), color.g*cos(time), color.b, 1.);
}