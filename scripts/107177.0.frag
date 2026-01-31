#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;

float rand(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main( void ) {
	float time = 0.0;

	vec2 position = gl_FragCoord.xy / resolution.xy + vec2(0, 0);//( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float color = 0.0;
	
	if (rand(position / 20.0) > 0.996)
	{
		float r = rand(position);
		color = r * (0.85 * sin(time * (r * 5.0) + 720.0 * r) + 0.95);
	}
	gl_FragColor = vec4(vec3(color),1.0);

}