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
	
	float fcol = 0.5;

	
	fcol = rot_checker(p, 1.0, 0.5);

	
	
	gl_FragColor = vec4(fcol);

}