#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	gl_FragColor = vec4( .5 );
	vec2 uv = gl_FragCoord.xy/resolution;
	bool x_pass = abs(gl_FragCoord.x-resolution.x*.5) < -12.+resolution.x*.5;
	bool y_pass = abs(12.5+gl_FragCoord.y-resolution.y*.5) < -25.+resolution.y*.5;
	bool mousein = mouse.x < 0.97 && mouse.x > 0.03 && mouse.y < 0.87 && mouse.y > 0.04;
	if(x_pass && y_pass && mousein) gl_FragColor += 1.;
	
}