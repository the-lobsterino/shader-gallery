#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution;
	float amnt = 75.0;
	float nd = 0.0;
	vec4 cbuff = vec4(0.0);

	for(float i = 0.0; i < 5.0; i++){
		nd = sin(3.17 * 0.8 * pos.x + (i * 0.1 + sin(+time) * 0.4) + time) * 0.4 + 0.1 + pos.x;
		amnt = 1.0 / abs(nd - pos.y) * 0.01; 
		cbuff += vec4(amnt, amnt * 0.3 , amnt * pos.y, 90.0);
	}

	vec4 dbuff =  texture2D(backbuffer, 1.0 - pos) * 0.1;
  	gl_FragColor = cbuff + dbuff * 3.0;
}
