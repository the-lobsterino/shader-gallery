#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 palette(float t){
	vec3 a = vec3(0.5, 0.5 , 0.5);
	vec3 b = vec3(0.5, 0.5 , 0.5);
	vec3 c = vec3(0.5, 0.5 , 0.1);
	vec3 d = vec3(0.2, 0.4 , 0.7);
	
	return a + b * cos( 6.28318*(c*t*d) );
}

void main( void ) {
    	
	//vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + mouse / 2.0;
	//vec2 uv = ( gl_FragCoord.xy / resolution.xy ) / 2.0;
	
	vec2 uv = ( gl_FragCoord.xy * 2.0 - resolution.xy)  / resolution.y;
	vec2 uv0 = uv;
	vec3 finalColor = vec3(0.5);
	
	//uv *=  1.0;
	//uv = fract(uv);
	//uv -= 0.5;
		
	for(float i = 0.0; i < 2.0; i++){
		uv = fract(uv * 1.5) - 0.5;
	
		float _distance = length(uv);
		
		vec3 color = palette(length(uv0) + time);
	
		
		_distance = sin(_distance * 8.0 + time) / 8.0;
		_distance = 0.02 / _distance;
		_distance = abs(_distance);
		finalColor += _distance * color;
	};
	#define c finalColor
	c = 1. - pow(c, vec3( 2.-c*1.5 ) );
	c = 1. - exp(  -( c ) );
//	c = sqrt( c );	
	gl_FragColor = vec4( finalColor, 1.5 );

}//ändrom3da4twist