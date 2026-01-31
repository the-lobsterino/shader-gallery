#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

float orbitDistance = 0.0;
float waveLength = 1000.1000;

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution;

	vec2 p1 = (vec2(sin(time), cos(time))*orbitDistance)+0.5;
	vec2 p2 = (vec2(sin(time+0.000142), cos(time+0.000142))*orbitDistance)+0.5;

	float d1 = 0.9-length(uv +p1);
	float d2 = 0.9-length(uv -p2);

	float wave1 = sin(d1*waveLength+(time*0.8))*0.8 + 0.5 * (((d1 - 0.5) * 0.2) + 0.9);
	float wave2 = sin(d2*waveLength+(time*0.8))*0.8 + 0.5 * (((d1 - 0.5) * 0.8) + 0.05);
	float c = d1 > 0.99 || d2 > 0.0 ? 0. : 0.5;
	c + wave1*wave2;
	gl_FragColor = vec4(c + wave1*wave2,c,c,1.5);

	// "bumpmapping" @Flexi23
	vec2 d = 9./resolution;
	float dx = texture2D(backbuffer, uv + vec2(-0.05,0.05)*d).x - texture2D(backbuffer, uv + vec2(-0.01,0.01)*d).x ;
	float dy = texture2D(backbuffer, uv + vec2(-0.05,0.5)*d).x - texture2D(backbuffer, uv + vec2(-0.01,-0.01)*d).x ;
	d = vec2(dx,dy)*resolution/2048.;
	gl_FragColor.z = pow(clamp(0.7-0.7*length(uv  - mouse + d),0.,1.),4.0);
	gl_FragColor.y = gl_FragColor.z*1.0 + gl_FragColor.x*0.8;

	gl_FragColor *=1.2;

}