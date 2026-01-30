#ifdef GL_ES
precision mediump float;
#endif

// Digital clock with animation!

uniform float time;
uniform vec2 resolution;

const vec3 ledColor = vec3(1.0, 0.2, 0.4);
const float sharpness = 35.0;
const float thickness = 0.35;
const float degToRad = 0.017453292519943295;


vec4 seq(int digit, int seg) {
	// vec4 (X, Y, start ang, end ang)
	// if X >= 8, this is a child
	if (digit == 0) {
		if (seg == 0) return vec4( 0, 1, 0, 0);
		if (seg == 1) return vec4( 8, 0, 90, 90);
		if (seg == 2) return vec4( 8, 0, 0, 0);
		if (seg == 3) return vec4( 8, 0, 90, 90);
		if (seg == 4) return vec4( 8, 0, 90, 90);
		if (seg == 5) return vec4( 8, 0, 90, 0);
	} else if (digit == 1) {
		if (seg == 0) return vec4(-1, 0, 90, 90);
		if (seg == 1) return vec4( 8, 0, 90, 180);
		if (seg == 2) return vec4( 8, 0, 90, 180);
		if (seg == 3) return vec4(-1, 0,-90,-90);
		if (seg == 4) return vec4( 8, 0,-90,-180);
		if (seg == 5) return vec4( 8, 0,-90,-180);
	} else if (digit == 2) {
		if (seg == 0) return vec4(-1, 0, 90, 90);
		if (seg == 1) return vec4( 8, 0, 180, 90);
		if (seg == 2) return vec4(-1, 0,-90, -180);
		if (seg == 3) return vec4( 8, 0, 180, 90);
		if (seg == 4) return vec4(-1, 1, 90, 180);
	} else if (digit == 3) {
		if (seg == 0) return vec4( 0, -1, 0, 0);
		if (seg == 1) return vec4( 8, 0,-90,-90);
		if (seg == 2) return vec4( 8, 0,-90,-90);
		if (seg == 3) return vec4( 0, 1, 90, 0);
		if (seg == 4) return vec4(-1, 1, 180, 90);
	} else if (digit == 4) {
		if (seg == 0) return vec4( 0, 0, 0, 0);
		if (seg == 1) return vec4(-1, 0, 90, 90);
		if (seg == 2) return vec4(-1, 0,-90,-90);
		if (seg == 3) return vec4( 8, 0,-90,-180);
		if (seg == 4) return vec4( 0,-1, 0,-90);
	} else if (digit == 5) {
		if (seg == 0) return vec4( 0, 0, 0, 0);
		if (seg == 1) return vec4( 8, 0,-90,-90);
		if (seg == 2) return vec4( 8, 0,-180,-90);
		if (seg == 3) return vec4( 0, 0, 90, 90);
		if (seg == 4) return vec4(-1,-1,-90,-180);
	} else if (digit == 6) {
		if (seg == 0) return vec4(-1,-1, 180, 180);
		if (seg == 1) return vec4( 8, 0, 90, 90);
		if (seg == 2) return vec4( 8, 0, 90, 90);
		if (seg == 3) return vec4( 8, 0,-90,-90);
		if (seg == 4) return vec4( 8, 0,-90,-90);
		if (seg == 5) return vec4( 8, 0,-180,-90);
	} else if (digit == 7) {
		if (seg == 0) return vec4(-1,-1, 180, 180);
		if (seg == 1) return vec4( 8, 0, 90, 180);
		if (seg == 2) return vec4(-1, 0, 180, 90);
		if (seg == 3) return vec4(-1, 0,-90,-90);
		if (seg == 4) return vec4(8, 0,-90,-180);
		if (seg == 5) return vec4(8, 0,-90,-180);
	} else if (digit == 8) {
		if (seg == 0) return vec4(-1,-1, 180, 180);
		if (seg == 1) return vec4( 8, 0, 180, 90);
		if (seg == 2) return vec4( 8, 0, 180, 90);
		if (seg == 3) return vec4(-1, 0, 90, 90);
		if (seg == 4) return vec4(-1, 0,-90,-90);
		if (seg == 5) return vec4( 8, 0,-180,-90);
		if (seg == 6) return vec4( 8, 0,-180,-90);
	} else if (digit == 9) {
		if (seg == 0) return vec4(-1, 0, 90, 90);
		if (seg == 1) return vec4( 8, 0, 90, 90);
		if (seg == 2) return vec4( 8, 0, 90, 90);
		if (seg == 3) return vec4( 8, 0, 90, 90);
		if (seg == 4) return vec4( 8, 0,-90,-90);
		if (seg == 5) return vec4( 8, 0,-90,-90);
		if (seg == 6) return vec4( 8, 0,-90,-180);
	}
	
	return vec4(8, 0, 180.0, 180.0);
}

float constrainFloat( float v ) {
	return max(0.0, min(1.0, v));
}

float bar( vec2 pos ) {
	float sides = constrainFloat( (thickness - abs(pos.y)) * sharpness );
	return constrainFloat((2.0 - abs(pos.x - 2.0 ) - abs(pos.y)) * sharpness) * sides;
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

float renderDigit(vec2 position, int digit, float trans) {
	vec2 world = position;
	float color = 0.0;

	for (int i=0; i<8; i++) {
		vec4 prop = seq(digit, i);
		float ang = mix(prop.z, prop.a, trans);
		if (prop.x < 8.0) {
			position = world + vec2(prop.x, prop.y)*4.0;
		}
		if (abs(ang) < 180.0 || prop.x < 8.0) {
			position = rotate(position, ang * degToRad);
			color += bar(position);
			position.x -= 4.0;
		}
	}
	return color;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position -= 0.5;
	if (resolution.x > resolution.y) {
		position.x *= resolution.x/resolution.y;
	} else {
		position.y *= resolution.y/resolution.x;
	}

	float color = 0.0;
	position *= 15.0;
	position.x += 2.0;

	color += renderDigit(position + vec2(6.0, 0.0), int(mod(floor(time / 100.0), 10.0)), constrainFloat(fract(time / 100.0) * 300.0));
	color += renderDigit(position, int(mod(floor(time / 10.0), 10.0)), constrainFloat(fract(time / 10.0) * 30.0));
	color += renderDigit(position + vec2(-6.0, 0.0), int(mod(floor(time), 10.0)), constrainFloat(fract(time) * 3.0));
	
	
	
	gl_FragColor = vec4( ledColor * constrainFloat(color), 1.0 );

}