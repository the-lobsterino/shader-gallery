#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265358979;

float ans, si, lp, ld;
float cr, cg, cb, cl;

void main( void ) {
	
	vec2 pos = gl_FragCoord.xy / max(resolution.x, resolution.y) + vec2(mouse.x-0.5, mouse.y+0.5) / 4.0;
	
	cr = 0.;
	cg = 0.;
	cb = 0.;
	cl = 0.;
	
	for(int i=0; i < 3; i++) {
		
		ans =
			abs(length(
				vec2(
					pos.x + sin(PI*2.0 * float(i)/16.0 + time/10.0)/2.0,
					pos.y + cos(PI*2.0 * float(i)/8.0 + time/10.0)/2.0
				)-0.5
			)-0.4);
		si = 0.08;
		lp = 16.0;
		ld = 1.0;
		
		if(ans < si) {
			
			cl = pow((si-ans)/si + 1.0, lp) / pow(2.0, lp-ld);
			
			cr += cl;
			cg += cl;
			cb += cl;
		}
		
		if(cr > 1.) cr = 1.;
		if(cg > 1.) cg = 1.;
		if(cb > 1.) cb = 1.;
		if(cr < 0.) cr = 0.;
		if(cg < 0.) cg = 0.;
		if(cb < 0.) cb = 0.;
	}
	gl_FragColor = vec4( cr, cg, cb, 1. );

}