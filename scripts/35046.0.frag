#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float r, g;
	
	vec4 t = gl_FragCoord;
	
	for (int i = 0; i < 8; i++){
		t.x += sin(t.y/100.0 + time) * 10.0;
		t.y += sin(t.x/100.0 - time) * 10.0;
	}
	
	if (2.0 > mod(t.x, 20.0))
		r = 0.5;
	else
		r = 0.0;
	
	if (2.0 > mod(t.y, 20.0))
		g = 0.5;
	else
		g = 0.0;

	gl_FragColor = vec4(r, g, t.y/resolution.y, 1.0);

}