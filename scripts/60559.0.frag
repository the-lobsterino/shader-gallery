#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bk;
varying vec2 surfacePosition;
void main( void ) {
	vec2 p = surfacePosition*2.;
	float th = atan(p.x,p.y);
	
	float color = 0.0;
	
	color = fract(pow(cos(th+time/5.), 2.)-(pow(p.y, 2.)+pow(p.x, 2.)));
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	
	gl_FragColor.g += .9*(texture2D(bk, gl_FragCoord.xy/resolution) - gl_FragColor).g;
	gl_FragColor.r += .975*(texture2D(bk, (gl_FragCoord.xy+vec2(1,0))/resolution) - gl_FragColor).r;
	//gl_FragColor.b += .99*(texture2D(bk, (gl_FragCoord.xy-vec2(1,2))/resolution) - gl_FragColor).b;
}