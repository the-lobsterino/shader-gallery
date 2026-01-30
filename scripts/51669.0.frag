#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform sampler2D backbuffer;
uniform vec2 resolution;

uniform vec2 mouse;
uniform float time;

const int numPoints = 8;
vec2 cells[8];
float cellWeights[8];
uniform int cellCount;


vec3 get(vec2 p, float w) {
	return w * texture2D(backbuffer, p).rgb;
}

float r1(float self, float sum) {
	if (self == 1.0) {
		if (sum < 2.0 || sum > 3.0) {
			return 0.0;
		} else {
			return 1.0;
		}
	} else {
		if (sum == 3.0) {
			return 1.0;
		} else {
			return 0.0;	
		}
	}
}

void main( void ) {

	cellWeights[0] = 0.0;
	cellWeights[1] = 0.0;
	cellWeights[2] = 0.0;
	cellWeights[3] = 0.0;
	cellWeights[4] = 0.0;
	cellWeights[5] = 3.0;
	cellWeights[6] = 0.0;
	cellWeights[7] = 3.0;
	
	cells[0] = vec2(-1.0, -1.0);
	cells[1] = vec2(0.0, -1.0);
	cells[2] = vec2(1.0, -1.0);
	cells[3] = vec2(-1.0, 0.0);
	cells[4] = vec2(1.0, 0.0);
	cells[5] = vec2(-1.0, 1.0);
	cells[6] = vec2(0.0, 1.0);
	cells[7] = vec2(1.0, 1.0);
	
	
    
	float sum = 0.0;

	for (int i = 0; i < 8; i++) {
		vec2 p = (gl_FragCoord.xy + cells[i]) / resolution.xy;
		float w = cellWeights[i];
		sum += get(p, w).r;
	}
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	if (length(mouse.xy - uv.xy) < 2.0 / max(resolution.x, resolution.y)) {
		sum = 3.0;
	}
	
	float result = r1(texture2D(backbuffer, uv).r, sum);
	
	vec3 c = vec3(result);
	if (c.r == 0.0) {
		c.b = texture2D(backbuffer, uv).b * 0.9;
		c.g = texture2D(backbuffer, uv).b * 0.9;
	}

	gl_FragColor = vec4(c, 1.0 );

}