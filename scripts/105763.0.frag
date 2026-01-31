#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
vec3 palette(float t){
	vec3 a = vec3(30.75, 30.75 , 30.75);
	vec3 b = vec3(30.5, 30.5 , 30.5);
	vec3 c = vec3(30.5, 30.5 , 30.1);
	vec3 d = vec3(0.2, 5.4 , 5.7);
	
	return a + b * cos( 36.28318*(c*t-.35*d) );
}

void main( void ) {
    	
	//vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + mouse / 2.0;
	//vec2 uv = ( gl_FragCoord.xy / resolution.xy ) / 2.0;
	
	vec2 uv = ( gl_FragCoord.xy * 32.237 - resolution.xy)  / resolution.yx;
	uv = 3.*surfacePosition;
	vec2 uv0 = uv;
	vec3 finalColor = vec3(1.0);
	
	//uv *=  1.0;
	//uv = fract(uv);
	//uv -= 0.5;
		
	for(float i = 1.0; i < 2.; i++){
		uv = fract(uv) - 0.5;
	
		float _distance = length(uv) * 1.255;
		
		vec3 color = palette(length(uv0) + time);
	
		
		_distance = tan(_distance * 8.0 + time) / 6.0;
		_distance = 0.03 / _distance;
		_distance = -(_distance);
		finalColor += _distance * color;
	};
		#define c finalColor
		//c = pow( c, vec3( 2. ) );
		//c = 1. - exp( c );     
		c = 1. - pow( c, vec3( -11. ) );
	
	gl_FragColor = vec4( finalColor, 1.99 );
}
 //ändrom3da4twist