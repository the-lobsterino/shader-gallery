#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

void main() {
	vec2 pos = surfacePosition*16.;
 
	float color = 0.0;
	float s = 1.0;
	float time = time * 1.7 - pow(time, 0.5)*0.3/length(pos);
	
	//pos += .5*cos(time*1e-2+length(pos))*mod(pos, (sin(time) + 3.0) * 0.2) - (sin(time) + 3.0) * 0.1;
	
	for(int i=0; i<20; ++i)
	{
		float fi = float(i);
		float t = atan(pos.x, pos.y)*3.141592653*2.*1.5/7.+10000./(.0001+fi);
		float len = (0.0002 * fi) / abs((0.016*fi)/(length(pos)+sin(-time+t*1.5)) - (0.5 + sin(t * (3.0 + fi)) * (0.2 - float(i) * sin(time + fi) * 0.01)));
		color += len * (1.0 - fi / 64.0);
	}
	color += length(pos) * 0.1;
	gl_FragColor = vec4(pow(color, 1.8)) * vec4(0.8, .9, 1.0, 1.);
	
	float gamma = 0.035;
	gl_FragColor *= gamma;
	gl_FragColor += (1.-gamma) * texture2D(backbuffer, gl_FragCoord.xy/resolution.xy);
}