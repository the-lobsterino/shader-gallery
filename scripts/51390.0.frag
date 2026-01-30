#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {
	vec2 s = surfacePosition*vec2(1.+sin(time+surfacePosition.x*10.)*2.*atan(surfacePosition.x), 1.)+vec2(0., -2.+cos(time/12.)*3.);
	float t = s.y;
	
	float w = t*sin(t*3.);
	
	float color = 0.;
	color += 1./(.2
		     +10.*abs(w)*float(s.y>=0.)
		     +abs(w-s.x*(4.-0.1*w*w)));
	color += 0.05*sin(color*w*65536.);
	color += 0.05*sin(color*w*256.);
	color += 0.05*sin(color*w*6.);
	color += 0.05*sin(color*w*4.);
	color -= 0.05*sin(color*w*2.);
	color -= 0.05*sin(color*w*1.);
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}