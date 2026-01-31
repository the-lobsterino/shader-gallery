#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 o_trn = ( (gl_FragCoord.xy - resolution.xy*0.5) / resolution.yy );
	float n_min = 1.;
	
	const float n_its = 111.;
	float n_tau = 6.2831;
	vec3 o_col = vec3(1.);
	for(float n_it = 0.; n_it < n_its; n_it+=1.){
		
	    float n_it_nor = float(n_it / n_its);
  	    vec2 o_sincos =vec2(sin(n_it_nor*n_tau), cos(n_it_nor*n_tau));
	    vec2 o_trn2 = o_sincos*(sin(time+n_it_nor*n_tau*99.*time*mouse.x*0.01))*.45;
	    float n_d = length(o_trn2-o_trn);
	    n_d = pow(n_d, 1./((n_it_nor+.5)*10.));
	    if(n_d < n_min){
	    	o_col = vec3(n_it_nor);
	    	n_min = n_d;
	    }
	    
	}
	
	gl_FragColor = vec4(sqrt(1.-n_min)*o_col, 1.);
}