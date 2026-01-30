#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main( void ) {
	vec2 res = resolution.xy;
	vec2 p = 2.*(gl_FragCoord.xy-res/2.) / res.y;
	float r;
	vec3 col = vec3(0.);
    
	
	const float I = 16.;
	for(float i=1.; i<=I; i++) {
		if(length(p)<1.) {
			r = cos(time*.2+.3*i)/2.;
			if(p.x<2.*r) {
				p.x -= r-.5;
				p /= r+.5;
			} else {
				p.x -= r+.5;
				p /= r-.5;
			}
			col.r = i/(I*1.5);
			col.b = 0.1-r;
		}
    	}
    
	gl_FragColor = vec4(col, 1.);
}