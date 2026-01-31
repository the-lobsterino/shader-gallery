#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float _squareNum =time;
float _Brightness = 5.1;

vec2 random2(vec2 st){
	st = vec2(dot(st, vec2(127.1, 311.7)),dot(st, vec2(269.5, 183.3)));
	return -1.0 + 2.0 * fract(sin(st)*mouse +time/100.);
}

void main( void ) {

	vec2 st = ( gl_FragCoord.xy / resolution.xy );
	st *=  _squareNum;
	
	vec2 ist = floor(st);
	vec2 fst = fract(st);
	
	float  distance = 5.;
	vec2 p_min;

	for (int y = -1; y <= 1; y++){
		for (int x = -1; x <= 1; x++){
			vec2 neighbor  = vec2(x,y);
			
			vec2 p = 0. + 1. * sin(time * random2(ist + neighbor));
			
			vec2 diff = neighbor + p - fst;
			if(distance > length(diff)){
    				distance = length(diff);
    				//最も近い白点も更新
    				p_min = p;
			}
		}
	}
			

	gl_FragColor = vec4(vec3(p_min,1.), 1.0 );

}