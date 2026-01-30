#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int max_iter = 50;

float mandel(vec2 point) {
	vec2 a = vec2(0.0, 0.0);
	for(int i = 0; i < max_iter; i++) {
		if( length(a*a) > 4.0)
			return float(i)/float(max_iter);
		vec2 tmp = a;
		a.x = a.x*a.x - a.y*a.y;
		a.y = 2.0*tmp.x*tmp.y;
		a += point;
	}
	return 0.0;
}

#define yeah

void main( void ) {
	
	float aspect = resolution.x / resolution.y;
	vec2 position;
	position.x =  aspect * gl_FragCoord.x / resolution.x;
	position.y = gl_FragCoord.y / resolution.y;
	position -= vec2(1.1, 0.5);
	position *= 2.0;
	//position.xy = -position.yx;
	


	float n = mandel(position);
	gl_FragColor = vec4(
		pow(sin(n), 2.0)*pow(sin(time),2.0),
		log(n)*pow(cos(time),2.0),
		pow(sin(n), 2.0)*pow(cos(time),2.0),
		1.0);
}