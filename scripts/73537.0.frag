#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float _uvVAR = 2.0;

const int _loopVAR = 3;

void main( void ) {
	
	vec2 uv = (gl_FragCoord.xy * _uvVAR - resolution) / resolution.x;
	vec3 color;
	float y = uv.y + time;
	for (int i = 0; i < _loopVAR; i++) {
		float d = uv.x - sin(y * float(3+i)/4.) * .1000000000000000000000000000
	
			;
		color[i] = .050 / (d * d);
	}
	gl_FragColor = vec4(color, 5
			 );
}
