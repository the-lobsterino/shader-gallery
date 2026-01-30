#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 uv, vec2 pos) {
	return length(uv - pos) * 25.0;
}

void main( void ) {
	vec2 asp = resolution / min(resolution.x, resolution.y);
	vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * asp;
	
	vec2 m = vec2(cos(time), sin(time));//asp * (mouse * 2.0 - 1.0);
	vec2 s = vec2(m.x + cos(time), m.y + sin(time));
	
	for (float i = 0.0; i < 24.; i++) {
		if(i < 8.){
			float d = ball(uv, m * vec2(0.5 * sin(i)+cos(i + time*i), sin(i + time*i)))/sin(i);
			gl_FragColor += vec4(sin(i)/d, sin(i)/d, 0. , 1.);
		}
		else if(i < 16.){
			float d = ball(uv, m * vec2(0.5 * sin(i)+cos(i + time*i/10.), sin(i + time*i/10.)))/sin(i);
			gl_FragColor += vec4(sin(i)/d, 0., 0. , 1.);
		}
		else{
			float d = ball(uv, m * vec2(cos(i + time*i/20.), sin(i + time*i/20.)))/sin(i);
			gl_FragColor += vec4(0., 0., sin(i)/d , 1.);
		}
	}
}