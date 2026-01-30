// Conway's game of life

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec4 live = vec4(0.0,1.0,0.0,1.);
vec4 dead = vec4(0.,0.,0.,1.);


void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 pixel = 1. / resolution;
	vec2 mousePos = floor(mouse.xy*resolution.xy+vec2(0.5))-vec2(0.5);
	
	if (length(gl_FragCoord.xy-mousePos) < length(1.01)) gl_FragColor = live;
	else {
		float sum = 0.;
		sum += texture2D(backbuffer, position + pixel * vec2(-1., -1.)).g;
		sum += texture2D(backbuffer, position + pixel * vec2(-1.,  0.)).g;
		sum += texture2D(backbuffer, position + pixel * vec2(-1.,  1.)).g;
		sum += texture2D(backbuffer, position + pixel * vec2( 1., -1.)).g;
		sum += texture2D(backbuffer, position + pixel * vec2( 1.,  0.)).g;
		sum += texture2D(backbuffer, position + pixel * vec2( 1.,  1.)).g;
		sum += texture2D(backbuffer, position + pixel * vec2( 0., -1.)).g;
		sum += texture2D(backbuffer, position + pixel * vec2( 0.,  1.)).g;
		vec4 me = texture2D(backbuffer, position);

		if (me.g != live.g) {
			if ((sum >= 2.9) && (sum <= 3.1)) gl_FragColor = live;
			else                              gl_FragColor = dead;
		} else if ((sum >= 1.9) && (sum <= 3.1))  gl_FragColor = live;
	}
}