
precision mediump float;

varying vec2 surfacePosition;
uniform float time;
uniform vec2 resolution;

void main(void) {
	float c = 2.5/(length(surfacePosition));
	c += 2.5/distance(vec2(0.0, 0.0), surfacePosition.xy - vec2(0.0, 0.0)/resolution.xy);
	vec3 light_color = vec3(2.0, 0.92, 0.72); // RGB, proportional values, higher increases intensity
	c += sin(surfacePosition.x+(surfacePosition.y/((time*10.)+(cos(surfacePosition.x/100.)*151.))));
	
	gl_FragColor = vec4(vec3(c) * light_color, 1.0);
}