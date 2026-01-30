#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D texture;
const int NUM_POINTS = 300;
vec2 body[NUM_POINTS];
	

void addToBody(vec2 pos) {
	for (int i = 0; i < NUM_POINTS-1; i++) {
		body[i+1] = body[i];	
	}
	body[0] = pos;
}

float rand(vec2 p){
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float getDist(vec2 p1, vec2 p2) {
	float dx = p2.x - p1.x;
	float dy = p2.y - p1.y;
	return dx * dx + dy * dy;
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float mouse_move_variability = .1;
	vec2 points_center = (.5 - mouse_move_variability * .5) + mouse.xy * mouse_move_variability;
	float adx = sin(time*.5);
	float ady = 1. - adx;
	
	for (int i = 0; i < NUM_POINTS; i++) {
		float dist = float(i) * .001;
		float angle = sin(time * .1 + float(i) * .005) * 6.28;
		vec2 dir = vec2(cos(angle) * dist, sin(angle) * dist);
		vec2 point = vec2(mouse.xy) + dir;
	
		// if pixel is close to point, draw white
		float distSq = getDist(position, point);
		if (distSq < .0001) {
			gl_FragColor = vec4(1, 1, 1, 1);
			return;
		}
	}
	
	// randomly reset pixels to black
	if (rand(position + time) < .1) {
		gl_FragColor = vec4(vec3(0), 1);	
		//return;
	}
	
	// fade white pixels from white -> red -> black
	vec3 color = texture2D(texture, position).xyz;
	vec3 fade_rate = vec3(.99, .95, .8);
	if (rand(position + time) < .1) {
		fade_rate *= .9;	
	}
	vec3 next_color = color * fade_rate;
	gl_FragColor = vec4(next_color, 1.);

}