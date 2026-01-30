#ifdef GL_ES
precision mediump float;
#endif

/*

tool to help identify when mouse movements skip pixels

*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	
	gl_FragColor = vec4(1);
	
	vec4 lastcolor = texture2D(backbuffer, p);
	
	if(lastcolor.x < 1.){
		gl_FragColor = lastcolor+1./255.;
	}
	
	bool qualX = abs(mouse - p).x < 0.501/resolution.x;
	bool qualY = abs(mouse - p).y < 0.501/resolution.y;
	if(qualX || qualY){
		gl_FragColor = min(gl_FragColor, vec4(0.9));
	}
	if(qualX && qualY){
		gl_FragColor = vec4(0.);
	}
	
	gl_FragColor.w = 1.;
}