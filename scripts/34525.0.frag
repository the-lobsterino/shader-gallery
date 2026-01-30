#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// rotate the vector "v" by the counterclockwise angle
// between the normalized vector "direction" and
// the vector (1, 0)
vec2 rotateTowards(vec2 v, vec2 direction){
	return vec2(
		v.x*direction.x - v.y*direction.y,
		v.x*direction.y + v.y*direction.x);
}

// calculate closest distance between point p and line (a, b)
float line_dist(vec2 p, vec2 a, vec2 b){
	vec2 ba = b - a;
	float u = clamp(dot(p - a, ba)/dot(ba, ba), 0.0, 1.0);
	vec2 q = a + u*ba;
	return distance(p, q);
}

void main(){
	// screen pixel position
	vec2 position = gl_FragCoord.xy;
	
	// center of screen
	vec2 center = resolution*0.5;
	
	// direction from center of screen towards mouse pointer
	vec2 direction = normalize(mouse*resolution - center);
	
	// vector to the right
	vec2 v0 = vec2(+300.0, 0.0);
	// vector to the left
	vec2 v1 = vec2(-300.0, 0.0);
	
	// points to the right and left of the center, rotated by mouse angle
	vec2 a = center + rotateTowards(v0, direction);
	vec2 b = center + rotateTowards(v1, direction);
	
	// distance to line (a, b)
	float dist = line_dist(position, a, b);
	// smooth gray value based on distance
	float gray = smoothstep(0.0, 1.0, dist);

	gl_FragColor = vec4(gray);

}