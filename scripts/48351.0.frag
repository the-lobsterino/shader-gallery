#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265358979;

vec2 pos;
float ans, si, lp, lc;
float cr, cg, cb, cl;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + vec2(mouse.x-0.5, mouse.y-0.5) / 4.0;
	
	
	for(int i=0; i < 100; i++) {
		
		pos = vec2(
			position.x-0.5 + 0.3*sin(float(i) + time/10.0),
			position.y-0.5 + 0.3*cos(float(i) + time/10.0)
		);
		
		si = abs(sin(float(i)/2.0))/10.0;
		lp = 16.0;
		lc = 0.1 + 1.0 * abs(sin(PI * 2.0 * float(i) * time/2.0 / 100.0));
		
		
		ans = length(pos);
		
		if(ans < si) {
			cl = pow((si-ans)/si + 1.0, lp) / pow(2.0, lp-lc);
			
			cr += cl;
			cg += cl*1.4;
			cb += cl*(1.0+abs(sin((0.6 + time)/2.0)));
		}
	}

	gl_FragColor = vec4( vec3( cr, cg, cb ), 1.0 );

}