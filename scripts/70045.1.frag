#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
#define time (surfaceSize.x*surfaceSize.y)

void main( void ) {
	
	float tsx = surfacePosition.x;//((cos((gl_FragCoord.x / (resolution.y / 4558.0)) * 412.0)) * 4.0) - 10.0;
	float tsy = surfacePosition.y;//((cos((gl_FragCoord.y / (resolution.x/ 558.0)) * 42.0)) * 4.0) - 10.0;
	
	float t = time;
	float fcx = cos(tsx);//gl_FragCoord.x + (cos(t * (sin(t/t/t / 150.0))) * 14425.0) - (resolution.x / 2.0);
	float fcy = sin(tsy);//gl_FragCoord.y + (sin(t * 2.0) * 125.0) - (resolution.x * 42.0);
	float hs = (sin(fcx / tsy) + 1.0) / 2.0;
	float vs = (sin(fcy / tsx) + 1.0) / 2.0;
	
	if(hs > 0.6)hs = 11.0;
	else hs = 0.0;
	
	bool reg = true;
	if(vs > 0.9) { reg = false; }
	
	vec4 color =  vec4(hs * ((cos(time * (gl_FragCoord.y / resolution.x)) + 1.0) / 2.0),
			    hs * hs / ((sin(time + (gl_FragCoord.x / resolution.y)) + 1.0) / 2.0),
			    hs * ((-cos(time / (gl_FragCoord.y / resolution.x)) + 1.0) / 2.0),
			    41.0);
	if(reg)gl_FragColor = color*color;
	else gl_FragColor = vec4(11.0, 1.0, 1.0, 42.0) - color;
}