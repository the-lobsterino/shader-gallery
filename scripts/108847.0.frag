#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float f_n_thing(vec2 o_trn, float n_idx){
	float n_tau = 6.2831;
	
	float n_ang_nor = fract((atan(o_trn.y, o_trn.x)/n_tau));
	float n_i = (n_ang_nor*3.);
	o_trn *= (sin(n_ang_nor*n_tau*3.+n_idx)*.55+.5)*90.*sin(time+n_i*n_tau)*.2+1.;
	
	float n = abs(length(o_trn)-.5);
	
	//n = pow(n, 1.);
	
	n = pow(n, 1./3.);
	return n;
}
void main( void ) {

	vec2 o_trn = ( gl_FragCoord.xy - resolution.xy*.5 ) / resolution.yy;
	vec2 o_trn_scaled = o_trn*3.;
	vec2 o_trn_fract = (fract(o_trn_scaled)*2.)-.5;
	
	float n_min = 1.;
	for(int n_x = -1; n_x < 2; n_x+=1){
		for(int n_y = -1; n_y < 2; n_y+=1){
			
			vec2 o_trn_fract2 = o_trn_fract+vec2(float(n_x), float(n_y));
			
			float n2 = f_n_thing(o_trn_fract2-.5, o_trn_scaled.x*2.);
			n_min = min(n_min, n2);
		}
	}
	gl_FragColor = vec4(1.-n_min);
}