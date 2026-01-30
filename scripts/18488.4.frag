#ifdef GL_ES
precision mediump float;
#endif
#define pi 3.14159
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 wPos = vec2(gl_FragCoord.xy/resolution.xy);
	vec3 frag = vec3(0.0);
	for (float f = 0.0; f<20.0; f++){
		vec2 Pos = vec2(0.5*(cos(time/7.0)*cos(time+(2.0*pi*f)/20.0)/2.0)+0.5 + cos(time * 1.) * .1,
				0.5*(sin(time/3.0)*sin(time+(2.0*pi*f)/20.0)/2.0)+0.5 + sin(time * 1.) * .1);
		float intensity = 0.003/(length(wPos-Pos));
		vec3 bcol = vec3(sin(Pos.x * 20.), sin(Pos.x * 30.), sin(Pos.y * 30.));
		frag += intensity*bcol;
	}
	gl_FragColor = vec4(frag, 1.0);

}