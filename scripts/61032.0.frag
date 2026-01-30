#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
 

const float _AA = float(0xAA) / float(0xFF);
const float _55 = float(0x55) / float(0xFF);

#define MOD(x, y)	( int(x - y * float(int(x/y))) )

float tamper_for_position(vec2 position) {
	int x_pos = MOD(position.x, 4.0);
	int y_pos = MOD(position.y, 4.0);
	
	float m = 0.0;
	
	if (y_pos == 0) {
		if (x_pos == 0) {
			m = 0.0;
		} else if (x_pos == 1) {
			m = 8.0;
		} else if (x_pos == 2) {
			m = 2.0;
		} else if (x_pos == 3) {
			m = 10.0;
		}
	} else if (y_pos == 1) {
		if (x_pos == 0) {
			m = 12.0;
		} else if (x_pos == 1) {
			m = 4.0;
		} else if (x_pos == 2) {
			m = 14.0;
		} else {
			m = 6.0;
		}
	} else if (y_pos == 2) {
		if (x_pos == 0) {
			m = 3.0;
		} else if (x_pos == 1) {
			m = 11.0;
		} else if (x_pos == 2) {
			m = 1.0;
		} else {
			m = 9.0;
		}
	} else if (y_pos == 3) {
		if (x_pos == 0) {
			m = 15.0;
		} else if (x_pos == 1) {
			m = 7.0;
		} else if (x_pos == 2) {
			m = 13.0;
		} else {
			m = 5.0;
		}
	}
	
	m /= 16.0;
	m -= 0.5;
	
	return m;
}

vec3 nearest_color(vec3 color) {
	// cga palette but without the greys
	vec3 palette[16];
	palette[0]  = vec3(0.0, 0.0, 0.0); // black
	palette[1]  = vec3(0.0, 0.0, _AA); // blue
	palette[2]  = vec3(0.0, _AA, 0.0); // green
	palette[3]  = vec3(0.0, _AA, _AA); // cyan
	palette[4]  = vec3(_AA, 0.0, 0.0); // red
	palette[5]  = vec3(_AA, 0.0, _AA); // magenta
	palette[6]  = vec3(_AA, _AA, 0.0); // brown
	palette[7]  = vec3(_55, _55, 1.0); // light blue
	palette[8]  = vec3(_55, 1.0, _55); // light green
	palette[9]  = vec3(_55, 1.0, 1.0); // light cyan
	palette[10] = vec3(1.0, _55, _55); // light red
	palette[11] = vec3(1.0, _55, 1.0); // light magenta
	palette[12] = vec3(1.0, 1.0, _55); // yellow
	palette[13] = vec3(1.0, 1.0, 1.0); // white
	
	palette[14] = vec3(_55, _55, _55); // dark grey
	palette[15] = vec3(_AA, _AA, _AA); // light grey
	
	vec3 bestCandidate = palette[0];
	float bestDistance = -1.0;
	
	for (int i = 0; i < 14; i += 1) {
		
		vec3 c = palette[i];
		vec3 d = (c - color);
		float distance = d.r*d.r + d.g*d.g + d.b*d.b;
		
		if (bestDistance < 0.0 || bestDistance > distance) {
			bestCandidate = c;
			bestDistance = distance;
		}
	}
	
	return bestCandidate;
}



void main( void ) {
	vec2 p=gl_FragCoord.xy/resolution;
	p.x*=resolution.x/resolution.y;
	float t= time;
	vec3 a=vec3(0.5, 0.5, 0.5);
	vec3 b=vec3(0.5, 0.5, 0.5);
	vec3 c=vec3(cos(t), sin(t), cos(t));
	vec3 d=vec3(0.0, 0.33, 0.67);
	vec3 col=a+b*cos(6.0*(c*p.y+d));
	
	 
	vec3 tmpColor = vec3( col );
	 

	float m = tamper_for_position(gl_FragCoord.xy);
	tmpColor = tmpColor + vec3(m, m, m);
	tmpColor = nearest_color(tmpColor);
	
	
	gl_FragColor = vec4(tmpColor, 1.0);
	
	
	 
}