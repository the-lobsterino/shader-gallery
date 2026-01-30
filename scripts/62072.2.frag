#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



#define C(a,b) vec2(float(a)/8.0,float(b)/8.0)
#define LINE roundLine

bool split(vec2 p, vec2 sp, vec2 dir) {
	return dot(p-sp, normalize(vec2(dir.y, -dir.x))) > 0.0;
}

bool circle(vec2 p, vec2 sp, float r) {
	return length(p-sp) <= r;	
}

bool squareLine(vec2 p, vec2 a, vec2 b, float w) {
	vec2 dir = normalize(b - a);
	vec2 nor = vec2(dir.y, -dir.x);
	return split(p, a - nor * w / 2.0, dir) &&
		split(p, a + nor * w / 2.0, -dir) &&
		split(p, a - dir * w / 2.0, -nor) &&
		split(p, b + dir * w / 2.0, nor);
}


bool cutLine(vec2 p, vec2 a, vec2 b, float w) {
	vec2 dir = normalize(b - a);
	vec2 nor = vec2(dir.y, -dir.x);
	return split(p, a - nor * w / 2.0, dir) &&
		split(p, a + nor * w / 2.0, -dir) &&
		split(p, a, -nor) &&
		split(p, b, nor);
}

bool roundLine(vec2 p, vec2 a, vec2 b, float w) {
	vec2 dir = normalize(b - a);
	vec2 nor = vec2(dir.y, -dir.x);
	return 
		(
			split(p, a - nor * w / 2.0, dir) &&
			split(p, a + nor * w / 2.0, -dir) &&
			split(p, a, -nor) &&
			split(p, b, nor)
		) ||
		circle(p, a, w / 2.0) ||
		circle(p, b, w / 2.0);
}

float beat() {
	//return 1.0 + pow(texture2D(iChannel0, vec2(0.5, 0.0)).r, 3.0);
	return 1.0;
}

bool digit(vec2 p, int d, float w) {
	if (d == 0) return
		LINE(p, C(1, 7), C(1, 5), w) ||
		LINE(p, C(1, 5), C(2, 4), w) ||
		LINE(p, C(2, 4), C(7, 4), w) ||
		LINE(p, C(7, 1), C(7, 7), w);
	
	else if (d == 1) return
		LINE(p, C(1, 6), C(2, 7), w) ||
		LINE(p, C(2, 7), C(6, 7), w) ||
		LINE(p, C(6, 7), C(7, 6), w) ||						
		LINE(p, C(7, 6), C(7, 5), w) ||
		LINE(p, C(7, 5), C(6, 4), w) ||
		LINE(p, C(6, 4), C(2, 4), w) ||			
		LINE(p, C(2, 4), C(1, 3), w) ||
		LINE(p, C(1, 3), C(1, 1), w) ||
		LINE(p, C(1, 1), C(7, 1), w);	
		
	else if (d == 2) return // T
		LINE(p, C(1, 6), C(2, 7), w) ||
		LINE(p, C(2, 7), C(6, 7), w) ||
		LINE(p, C(6, 7), C(7, 6), w) ||
		LINE(p, C(3, 1), C(5, 1), w) ||
		LINE(p, C(4, 7), C(4, 1), w);	
	else if (d == 3) return // O
		LINE(p, C(7, 6), C(6, 7), w) ||
		LINE(p, C(6, 7), C(2, 7), w) ||			
		LINE(p, C(2, 7), C(1, 6), w) ||	
		LINE(p, C(1, 6), C(1, 2), w) ||			
		LINE(p, C(1, 2), C(2, 1), w) ||			
		LINE(p, C(2, 1), C(6, 1), w) ||
		LINE(p, C(7, 6), C(7, 2), w) ||
		LINE(p, C(6, 1), C(7, 2), w);		
	else if (d == 4) return // K
		LINE(p, C(1, 7), C(1, 1), w) ||
		LINE(p, C(6, 7), C(1, 3), w) ||			
		LINE(p, C(3, 4), C(6, 1), w) ;					
	else if (d == 5) return // Y
		LINE(p, C(6, 7), C(3, 4), w) ||	
		LINE(p, C(1, 7), C(3, 4), w) ||	
		LINE(p, C(3, 4), C(3, 1), w) ;						
	else if (d == 6) return // E
		LINE(p, C(7, 6), C(6, 7), w) ||
		LINE(p, C(6, 7), C(2, 7), w) ||			
		LINE(p, C(2, 7), C(1, 6), w) ||	
		LINE(p, C(1, 6), C(1, 2), w) ||			
		LINE(p, C(1, 2), C(2, 1), w) ||			
		LINE(p, C(2, 1), C(6, 1), w) ||
		LINE(p, C(7, 6), C(7, 2), w) ||
		LINE(p, C(6, 1), C(7, 2), w);			
	else return
		false;
}


void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;	
	uv.y *= resolution.y / resolution.x;
	uv *= 6.0 + beat() * 10.0;	
	uv /= dot(uv, vec2(sin(time * 0.1), sin(time * 0.3))) * 0.1 + 3.0; // Tilting
	uv += time / 1.0;	
	
	bool b = digit(fract(uv), int(mod(time + floor(uv.x) + floor(uv.y), 7.0)), 0.05);		
	
	if (b)	gl_FragColor = vec4(0., abs(sin(0.5 * time)), 0.5, 1.0);
	else gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	
	if (mod(gl_FragCoord.y, 2.0) < 1.0) gl_FragColor *= 0.5;						
	if (mod(uv.x, 4.0) < 2.0) gl_FragColor *= 0.65;		
}