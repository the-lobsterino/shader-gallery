#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const vec4 water = vec4(0,0,.5,1);
const vec4 spec = vec4(1,1,1,1);
const vec4 air = vec4(0,0,0,1);

void main( void ) {

	float t = mod(time / 2., 2.*3.1415);
	bool current = texture2D(backbuffer, vec2(gl_FragCoord.x, gl_FragCoord.y) / resolution.xy).b > 0.5;
	
	if(distance(vec2(sin(t) * 0.5 + 0.5, 0.0) * resolution + vec2(0,1), gl_FragCoord.xy) < 3.0) {
		gl_FragColor = current ? air : vec4(1,1,1,1);
	} else 
	if(distance(mouse * resolution, gl_FragCoord.xy) < 3.0) {
		gl_FragColor = current ? air : vec4(1,1,1,1);
	} else {
			
		bool left = texture2D(backbuffer, vec2(gl_FragCoord.x - 1.0, gl_FragCoord.y) / resolution.xy).b > 0.5;
		bool right = texture2D(backbuffer, vec2(gl_FragCoord.x + 1.0, gl_FragCoord.y) / resolution.xy).b > 0.5;
		bool upper = texture2D(backbuffer, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.0) / resolution.xy).b > 0.5;
		bool upper_left = texture2D(backbuffer, vec2(gl_FragCoord.x - 1.0, gl_FragCoord.y + 1.0) / resolution.xy).b > 0.5;
		bool upper_right = texture2D(backbuffer, vec2(gl_FragCoord.x + 1.0, gl_FragCoord.y + 1.0) / resolution.xy).b > 0.5;
		bool lower = texture2D(backbuffer, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.0) / resolution.xy).b > 0.5;
		bool lower_left = texture2D(backbuffer, vec2(gl_FragCoord.x - 1.0, gl_FragCoord.y - 1.0) / resolution.xy).b > 0.5;
		bool lower_right = texture2D(backbuffer, vec2(gl_FragCoord.x + 1.0, gl_FragCoord.y - 1.0) / resolution.xy).b > 0.5;
		
		bool lower_filled = lower && lower_left && lower_right;
		
		if(gl_FragCoord.y + 1. >= resolution.y) {
			upper = upper_left = upper_right = false;
		}
		
		if(gl_FragCoord.y < 1.) {
			lower = lower_left = lower_right = true;
		}
		vec4 last = texture2D(backbuffer, gl_FragCoord.xy / resolution.xy);
		
		if(current) {
			if(lower_filled) {
				gl_FragColor = last + vec4(0.03, 0.01, 0.01, 0.0);
			} else if(lower || (lower_left && left) || (lower_right && right)) {
				gl_FragColor = air;
			} else {
				gl_FragColor = last + vec4(0,0.2,0,0);
			}
		} else {
			if(lower && lower_right && right) {
				gl_FragColor = water;
			} else if(lower && lower_left && left) {
				gl_FragColor = water;
			} else if(upper || (upper_left && left) || (upper_right && right)) {
				gl_FragColor = water;
			} else if(lower_filled) {
				gl_FragColor = water;
			} else {
				gl_FragColor = vec4(0,0,0,1);
			}
		}
	}
	//gl_FragColor = vec4(0,0,0,0);
}