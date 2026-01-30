#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define t0 atan(surfacePosition.x, surfacePosition.y)
#define r0 length(surfacePosition)+t0*0.17
#define surfacePosition vec2(r0*cos(time+t0+r0*8.), r0*sin(time+t0+r0*8.))

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
	vec2 p = surfacePosition;
	float r = length(p)*2.0;
	float t = atan(p.y, p.x)+time*.2+r*1.;
	p = vec2(r*cos(t), r*sin(t));
	float fcol = 0.5;
	float time = time + length(p);
	p.x = mod(p.x, 0.4*cos(time)) + 1.0;
	p.y = mod(p.y, 0.4*cos(time)) + 0.5;
	fcol = rot_checker(p, 1.0, 0.5);
	gl_FragColor = vec4(1.-fract(fcol*1.5));
}