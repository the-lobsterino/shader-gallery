#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float checker(vec2 p, float x, float y){
	float ret = 0.5;
	if((p.x < x && p.x > x - 0.1) && (p.y < y && p.y > y - 0.1) || (p.x > x && p.x < x + 0.1) && (p.y > y && p.y < y + 0.1)){
		ret = 1.0;
	}else if((p.x > x && p.x < x + 0.1) && (p.y < y && p.y > y - 0.1) || (p.x < x && p.x > x - 0.1) && (p.y > y && p.y < y + 0.1)){
		ret = 0.0;
	}
	return ret;
}

float rot_checker(vec2 p, float x, float y){
	float ret = 0.5;
	y = mod(x, 0.2);
	if((p.x < x && p.x > x - 0.1) && (p.y < y && p.y > y - 0.1) || (p.x > x && p.x < x + 0.1) && (p.y > y && p.y < y + 0.1)){
		ret = 1.0;
	}else if((p.x > x && p.x < x + 0.1) && (p.y < y && p.y > y - 0.1) || (p.x < x && p.x > x - 0.1) && (p.y > y && p.y < y + 0.1)){
		ret = 0.0;
	}
	return ret;
}
	    

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	p.x *= resolution.x / resolution.y;
	mat3 a = mat3(
		cos(time),-sin(time),0,
		sin(time),cos(time),0,
		0,0,0
	);
	
	float fcol = 0.5;


	p = (a * vec3(p, 1.0)).xy;
	fcol = rot_checker(mod(p, 0.7), 0.5, 0.0);

	
	
	gl_FragColor = vec4(fcol);

}