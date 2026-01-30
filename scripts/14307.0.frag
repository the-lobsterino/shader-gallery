#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265358979

const float radius = 0.1;

float distance_to_line(vec2 a, vec2 b, vec2 p){
	vec2 ba = b - a;
	vec2 pa = p - a;
	float u = dot(ba, pa)/dot(ba, ba);
	// Line from a to b, not from -inf to +inf
	u = clamp(u, 0.0, 1.0);
	// q is point p projected on line ab
	vec2 q = a + ba*u;
	return distance(p, q);
}

float distance_to_color(float dist){
	// u is in [0, 1] for distance [0, radius]
	float u = clamp(dist/radius, 0.0, 1.0);
	// smooth color ramp from 1 to 0
	return cos(u*PI)*0.5 + 0.5;
}

void main(){
	float ratio = resolution.x/resolution.y;
	vec2 p = gl_FragCoord.xy / resolution.xy;
	p.x *= ratio;
	
	vec2 mouse_pos = mouse.xy;
	mouse_pos.x *= ratio;
	
	vec2 middle = vec2(ratio*0.5, 0.5);
	
	vec2 a = vec2(ratio*0.25, 0.5);
	vec2 b = middle;
	vec2 c = mouse_pos;
	
	// Distance to lines
	float d0 = distance_to_line(a, b, p);
	float d1 = distance_to_line(b, c, p);
	float d2 = distance(b, p);
		
	// Color from distance
	float c0 = distance_to_color(d0);
	float c1 = distance_to_color(d1);
	float c2 = distance_to_color(d2);
	
	// Calculate bendedness
	vec2 ab = a - b;
	vec2 cb = c - b;
	float bendedness = dot(ab, cb)/length(ab)/length(cb);
	bendedness = clamp(bendedness, 0.0, 1.0);
	
	// Add colors and subtract joint dot
	float straight = c0 + c1 - c2;
	// lerp between colors
	// Not quite happy with that because joint is too fat between 0 and 90 degrees
	float bended = c0*(1.0 - c1) + c1;
	// lerp between bended and straight colors
	float final_color = straight*(1.0 - bendedness) + bended*bendedness;
	
	gl_FragColor = vec4(final_color);
}