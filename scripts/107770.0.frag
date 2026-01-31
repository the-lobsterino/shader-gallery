#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float distanceFunction(vec3 pos, float r) {
	float d = length(pos) - r;
	return d;
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
	
	
	vec3  cameraPos = vec3(0., 0., -5.);
	float screenZ = 2.5;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	float depth = 0.0;
	
	vec3 col = vec3(0.0);
	
	for(int i = 0; i < 99; i++) {
		vec3 rayPos =  cameraPos + rayDirection * depth;
		float dist = sdSphere(
			rayPos * abs(
				sin(time+ 0.1) * 0.9 + cos(time + 0.23) * 1.2 / 2.
			),
			0.3
		);
		depth += dist;
		
		if(dist < 0.00001) {
			col = vec3(1.);
			break;
		}
	}
	
	gl_FragColor = vec4(col, 1.0);
}