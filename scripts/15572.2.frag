#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tex;
const int count = 22;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	vec4 texture = texture2D(tex,( gl_FragCoord.xy / resolution.xy ));
	float color;
	for(int i = 0; i < count; i++)
	{
		color += pow(1.0-min(length(position-vec2(cos(float(i)),1.0-mod(time/2.5+cos(float(i)*8.0),1.5))),1.0),80.0);	
	}
	gl_FragColor = vec4( vec3( color+position.y/30.0)+texture.rgb*vec3(0.9,0.75,0.5), 1.0 );

}