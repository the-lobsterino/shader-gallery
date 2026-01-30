precision mediump float;
uniform vec2 resolution;
uniform float time;

#define __ vec2((gl_FragCoord.xy*2.001-resolution.xy )/resolution.y)
#define tau 6.28318530718

void main() {
	vec2 _ = __;
	_ = vec2(atan(_.x, _.y)/2., 2.*length(_));
	_.y += cos(_.y*16.)*0.15;
	
	// tunnel 
	float d = pow(( _.y*_.y), 4.) / .5 + pow( (_.x*_.x), 4.) / 1.5;
	
	// wall texture
	float w = abs( 0.01 / sin( _.x * 12.) - d + cos( _.y) ) * abs(0.001 / sin( _.y * 12.) - .1 / d+cos(_.x ) );
	
	float flicker = fract( mod(time*.2,.75) / sin(time*3.2) );
	
	// light
	vec3 l =  vec3(flicker, .2, .9) * max(0.001, dot( w , .15/length(_ - vec2(.21-sin(time), cos(time*.5) ) ) ) ); 
	
	float s = sin(tau+time) * 0.1 + 0.1;
	float c = cos(tau+time) * 0.1 - 0.1;
	
	
	vec3 tri = ( sin( _.y * 2.001 )+vec3(0.,0.3, 1.) ) 
		    * float( 
			        c + _.y  > -s       - 0.2  
			    &&  s + _.x  >  c + _.y - 0.2 
			    &&  c + _.x  <  s - _.y + 0.2 ); 
	
	// ------------ shade
	
	// shade light
	gl_FragColor.rgb = vec3(1., 0., 0.) * 0.1 + sqrt( l ) ;
	
	// wall texture
	gl_FragColor.rgb /= w;
	
	//triangle
	gl_FragColor.rgb += tri;
	
	gl_FragColor.a = 1.;
}