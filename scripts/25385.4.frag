
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
#define uv surfacePosition
float r = 6e-6*length(surfaceSize);
float t = 1.*time;
uniform sampler2D backbuffer;

void dott(vec2 R){
	gl_FragColor.xyz -= r * pow(length(R-uv), -2.)*(1.-.4*length(gl_FragColor));
}

void fill(float x, float y){
	float lrad = 5./pow(x+1., 2.);
	float lphz1 = t*(y+1.) + x*mouse.x;
	float lphz2 = t*(y+1.) + y*mouse.y;
	dott(lrad*vec2(cos(lphz1), sin(lphz2)));
}

void main()
{
	gl_FragColor = vec4(1);
	
	const float iLim = 16.;
	for(float i=0.;i<iLim;i++) {
		for(float j=0.;j<2.*iLim*iLim;j++) {
			if(2.*j+1. > i) break;
			fill(i, j);
		}
	}
	
	gl_FragColor += 0.95*(texture2D(backbuffer, gl_FragCoord.xy/resolution) - gl_FragColor);
}