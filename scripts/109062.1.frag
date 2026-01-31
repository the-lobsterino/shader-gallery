#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = 4.0 * (gl_FragCoord.xy / resolution.xy);

	
	for(int n=2; n < 20; n++){
		float i = float(n);
		
		pos += vec2(
			0.3 / i * sin(i * pos.y * i + time / 10.0 + 0.9 * i) + 0.5,
			0.3 / i * sin(i * pos.x * i + time / 10.0 + 0.9 * i) + 1.5
		);	
	}
	
	
	float r = 0.5 * cos(pos.x) + 0.6;
	float g = r * cos(pos.x) + 0.8;
	gl_FragColor = vec4(r, g, g, 1);

}