#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 ballArea = gl_FragCoord.xy / vec2(4, 4);

	float color = 0.0;
	color += sin(ballArea.x + sqrt(time) * sin(time));
	color += sin(ballArea.y + sqrt(time) * sin(time));
	color += step(color / position.x * 2.0, 0.2);
	color /= sign(color);
	color += log2(color);
	color = abs(tan(position.x * 3.0 * position.y));
	
	color += tan(time / 4.0);

	vec3 finalColor = vec3( color, color * 0.2, sin( color ) * 0.8 );
	gl_FragColor.a = 1.0;
	gl_FragColor.rgb = texture2D(backbuffer, position).rgb * 0.4 + finalColor * 0.5;


}