#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D bk;

void main( void ) {
	gl_FragColor = vec4(1.);
	vec2 p = surfacePosition*1.3e-7;
	float T = .75;
	p = length(p)*vec2(sin(time*1e-2+T*atan(p.x, p.y)), cos(time*1e-2+T*atan(p.x, p.y)));
	float c = .25+pow(.5+.5*sin(p.x*10.), 2.)/2.;
	c *= pow(.5+.25*sin(p.y*10.), 1.);
	float time = time + 3e-1/length(p);
	c = pow(c, fract(length(p+vec2(sin(time), cos(time)))));
	
	gl_FragColor.xyz = vec3(c);
	
	gl_FragColor.z += (.9+.09*mouse.x)*(texture2D(bk, gl_FragCoord.xy/resolution).z - gl_FragColor.z);
	gl_FragColor.x += (.9+.09*mouse.y)*(texture2D(bk, gl_FragCoord.xy/resolution).x - gl_FragColor.x);
	
}