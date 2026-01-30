#extension GL_OES_standard_derivatives : enable

precision highp float;


// christmas balls

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 f_rgb_from_hsl( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main( void ) {

	vec2 o_trn = ( (gl_FragCoord.xy - resolution.xy*0.5) / resolution.yy );
	float n_min = 1.;
	
	const float n_its = 111.;
	float n_tau = 6.2831;
	vec3 o_col = vec3(1.);
	for(float n_it = 0.; n_it < n_its; n_it+=1.){
		
	    float n_it_nor = float(n_it / n_its);
  	    vec2 o_sincos =vec2(sin(n_it_nor*n_tau), cos(n_it_nor*n_tau));
	    vec2 o_trn2 = o_sincos*(sin(time+n_it_nor*n_tau*5.))*.45;
	    float n_d = length(o_trn2-o_trn)*10.;
	    float n_h = (floor(n_it_nor*3.))*0.3;
	    float n_l = floor(n_it_nor*2.)*.5+.5;
	    n_d = pow(n_d, 1./3.);//pow(n_d, 1./((n_it_nor+.5)*3.));
		
	    if(n_d < n_min){
	    	o_col = f_rgb_from_hsl(vec3(n_h, 1.-n_it_nor, n_l*1.))*(1.-n_d)*3.;
	    	n_min = n_d;
	    }
	    
	}
	
	gl_FragColor = vec4(sqrt(1.-n_min)*o_col, 1.)*vec4(vec3(1.-n_min),1.)+(1.-n_min)*0.2;
}