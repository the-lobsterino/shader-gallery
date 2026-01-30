#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


int numPoints = 8;
vec2 points[8];
float weights[8];

vec3 get(vec2 p, float weight) {
	return weight * texture2D(backbuffer, p).rgb;
}

void main( void ) {
	points[0] = vec2(-1.0, -1.0);
	points[1] = vec2(0.0, -1.0);
	points[2] = vec2(1.0, -1.0);
	points[3] = vec2(-1.0, 0.0);
	points[4] = vec2(1.0, 0.0);
	points[5] = vec2(-1.0, 1.0);
	points[6] = vec2(0.0, 1.0);
	points[7] = vec2(1.0, 1.0);
	
	weights[0] = 1.0;
	weights[1] = 1.0;
	weights[2] = 1.0;
	weights[3] = 1.0;
	weights[4] = 1.0;
	weights[5] = 1.0;
	weights[6] = 1.0;
	weights[7] = 1.0;
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	
	
	vec3 c;


	gl_FragColor = vec4(c, 1.0 );

}