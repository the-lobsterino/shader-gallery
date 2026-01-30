#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(void) {

	//vec2 uv = (gl_FragCoord.xy-0.5*resolution)/resolution.y - vec2(0.1,0);
	vec2 uv = surfacePosition;
	uv *= 0.45;
	uv.x -= 1.25;
	vec2 z = vec2(0,0);
	float color = 0.7;
	const int maxIterations = 200;
	for(int i = 0; i < maxIterations; i++){
		z =vec2(z.x*z.x - z.y*z.y,2.0*z.x*z.y) + uv;
		//if(i > int(mod(time*2.0*sqrt(float(maxIterations)),float(maxIterations))) && i > 0) break;
		if(z.x*z.x + z.y*z.y >= 4.0) {
			color = float(i)/float(maxIterations);
			break;
		}
	}
	gl_FragColor = vec4(vec3(color*length(z),color*z.y/length(z),color*z.x/(length(z) + color)),1.0);

}