#extension GL_OES_standard_derivatives : enable
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time ( time*1. + 0. )
vec3 palette(float t){
	vec3 a = vec3(0.5, 0.5 , 0.5);
	vec3 b = vec3(0.5, 0.5 , 0.5);
	vec3 c = vec3(0.5, 0.5 , 0.1);
	vec3 d = vec3(0.2, 0.4 , 0.7);
	
	return a + b * cos( 6.28318*(c*t+d) );
}

vec3 firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }

void main( void ) {
    	
	//vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + mouse / 2.0;
	//vec2 uv = ( gl_FragCoord.xy / resolution.xy ) / 2.0;
	
	
	
	vec2 uv = ( gl_FragCoord.xy * 2.0 - resolution.xy)  / resolution.y;
	vec2 uv1 = uv;
	vec2 uv0 = uv;
	vec3 finalColor = vec3(0.5);
	uv *= rot( time/8. );
	uv *=  1.5;
	//uv = fract(uv);
	//uv -= 0.5;
		
	for(float i = 0.0; i < 2.0; i++){
		uv = fract(uv * 1.5) - 0.5;
	
		float _distance = length(uv);
		
		float theta = atan( uv1.x, uv1.y );
		float lp = length( uv1 );
		vec3 color = firePalette( fract(4.*length(uv1) + time) );
		color += vec3( step( sin( theta*5. ), 0. ) );
		float check = mix( 0., mouse.x, 10. );
		uv1 *= rot( 300.*sin(time/5.)*lp/24. )*check;
		_distance = sin(_distance * 8.0 + time) / 8.0;
		_distance = 0.02 / _distance;
		_distance = abs(_distance);
		finalColor += _distance * color;
	};
	float flippy = uv1.x*mouse.x < 0. ? 1. : -1.;
	finalColor = 1. - exp( -pow( finalColor, vec3( flippy ) ) );
	gl_FragColor = vec4( finalColor, 1.0 );//ändrom3da4twist

}