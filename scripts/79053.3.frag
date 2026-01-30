#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int n = 20;
vec2 points[n];

float rnd (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main( void ) {
	
	vec2 st = gl_FragCoord.xy / resolution.xy;
	st.x *= resolution.x / resolution.y;
	
	//vec2 mpos = mouse;
	//mpos.x *= resolution.x / resolution.y;
	vec2 mpos = vec2(0.5 * resolution.x / resolution.y, 0.5);
	
	
	const int n = 5;
	vec2 points[n];
	
	float a = 0.1;
	
	for (int i = 1; i < n; i++) {
		points[i] = vec2(mpos.x + (sin(time) * a) + (float(i) * (sin(time) * a)), mpos.y + (cos(time) * a) + (float(i) * (cos(time) * a)));
	}
	
	
	
	
	vec3 col = vec3(0.1);
	
	if (rnd(st + (sin(time * 0.0000002) * 1.0)) < 0.0009) {
		col = vec3(1.0);
	}
	
	if (distance(st, mpos) < 0.1) {
		col = vec3(1.0, 0.5, 0.0);
	}
	
	
	for (int i = 1; i < n; i++) {
			if (mpos == points[i]) {
			}
			else {
				if (distance(st, points[i]) < 0.02) {
					col = vec3(0.3, 0.5, 1.0);
			}
		}
		 
	}
	
	

	gl_FragColor = vec4(col, 1.0);

}