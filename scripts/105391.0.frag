#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	float Rate = -2. ;
	vec2 uv = gl_FragCoord.xy / resolution.xy ;
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y ;
	float dist = length(uv) ;
	float dist2 = length(uv) ;
	float ringamount = 4. ;
	float thickness = .9 ;
	
	//dist = sin(dist*ringamount+ time * Rate) ;
	//dist = 1. - ((dist + 1. ) / 2. );
	dist = 1. - ((sin(dist*ringamount+ time * Rate) + 1. ) / 2. );
	//dist = smoothstep(thickness , thickness+ .1 ,dist);
	dist = smoothstep(thickness , thickness+ .1 ,1. - ((sin(dist*ringamount+ time * Rate) + 1. ) / 2. ));

	
	float ringcenter = .3 ;
	dist2 = 1. - smoothstep(ringcenter , ringcenter + .1 , dist2);
	
	
	gl_FragColor = vec4(vec3(dist+dist2), 1.0);

}