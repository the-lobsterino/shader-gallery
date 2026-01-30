
// Remix of http://glslsandbox.com/e#68042.0
// remixed by https://www.dwitter.net/u/rodrigo.siqueira

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359
void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	uv *= 1.0;
	
	float e = 0.0;
	for (float i = 5.0; i<=20.0; i+= 1.0) {
		//e += 0.03/abs(cos(PI * x * i/ 2.0));
	          e += 0.05/abs(sin(PI / i) - i/PI - sin(time/2.0) - (PI * uv.y * sin(uv.x) * 10.0));
	gl_FragColor = vec4( vec3(e/1.0, 0.0, 1.0), 1.0);	

	}
	
}