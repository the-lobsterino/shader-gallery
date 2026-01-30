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
	
	return a + b * cos(6.28318*(c*t+d) );
}

void main( void ) {
    
	
	vec2 uv = ( gl_FragCoord.xy * 2.0 - resolution.xy)  / resolution.y;
	vec2 uv0 = uv;
	vec3 finalcolor = vec3(0.0);

	uv*=sin(time)+8.;	
	
		uv = fract(uv * .5) - 0.5;
	
		float _distance = length(uv);
		
		vec3 color = palette(length(uv)+time*0.5 );
	
		
		_distance = sin(_distance * 8.0 +time*0.5) * .250;
		_distance = 0.1 / _distance;
		_distance = abs(_distance);
		finalcolor += _distance * color;
	
	
	gl_FragColor = vec4( finalcolor, 1.0 );

}