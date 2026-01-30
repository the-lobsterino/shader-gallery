#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x *= cos(4.0);
	position.y += sin(2.0);

	float t = (time) * (position.y);
	float f	= (time) * (position.y);
        float g = sin(length(t * f)) ;
	gl_FragColor = vec4((g),position.y+(g),tan(g),6.0);

}