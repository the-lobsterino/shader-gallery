#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// find distance from point p to line segment (a, b)
float line_distance(vec2 p, vec2 a, vec2 b){
	vec2 ba = b - a;
	float s = dot(p - a, ba)/dot(ba, ba);
	float u = clamp(s, 0.0, 1.0);
	vec2 q = a + u*ba;
	return distance(p, q);
}

void main(){
	// some point on screen
	vec2 p = gl_FragCoord.xy;
	
	// end points of line segments (a, b) and (b, c)
	vec2 a = vec2(100, 300);
	vec2 b = mouse*resolution;
	vec2 c = vec2(500, 200);
	
	// find distances to lines
	float dist0 = line_distance(p, a, b);
	float dist1 = line_distance(p, b, c);
	
	float combined_dist = (sin(time)*30.0)/sin(min(dist0, dist1));
	
	// distance to gray scale
	float gray = 0.0;
	if (combined_dist < 5.0) gray = 1.0;
	else if (combined_dist < 10.0) gray = 0.5;
	
	gl_FragColor = vec4(gray);

}