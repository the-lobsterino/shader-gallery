#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float sineWidth = -0.025;
	
	float w = 6.124*2.;
	float offset = time*w*0.25;
	float thresh = 0.35+sin(w*position.y + offset)*sineWidth;
	
	if (position.x > thresh)
	{
		gl_FragColor = vec4(1., 1., 0., 1.);
	}
	else
	{
		gl_FragColor = vec4(1., 0., 1., 1.);
	}
}