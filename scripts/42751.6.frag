#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	gl_FragColor = vec4(0,0,0,0);
	if(gl_FragCoord.x <= 2.){
		int mx3 = int(mod(gl_FragCoord.x*mouse.y+gl_FragCoord.y*mouse.x, 3.));
		gl_FragColor.g += .25+.5*float(mx3 == 1);
		gl_FragColor.r += .25+.5*float(mx3 == 2);
		gl_FragColor.b += .25+.5*float(mx3 == 0);
		
		gl_FragColor += float(
			(int(mod(gl_FragCoord.y, 3.)) == 1)
		     && (mx3 == 1)
		);
		return;
	}
	
	for(int i = 0; i <= 2; i++){
		vec2 sp = vec2(gl_FragCoord.x-1., gl_FragCoord.y+gl_FragCoord.x)/resolution;
		vec4 sc = texture2D(backbuffer, fract(sp));
		gl_FragColor[i] += 1.-sc[i];
	}
	
	for(int i = 0; i <= 2; i++){
		vec2 sp = vec2(gl_FragCoord.x-1., gl_FragCoord.y-gl_FragCoord.x)/resolution;
		vec4 sc = texture2D(backbuffer, fract(sp));
		gl_FragColor[i] = fract(gl_FragColor[i]+sc[i]);
	}
	if(gl_FragCoord.x > resolution.x/2.) gl_FragColor.a = 1.;
}
