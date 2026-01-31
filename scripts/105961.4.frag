#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	/*vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	float alpha = 1.0;
	if(mod(gl_FragCoord.y,10.0) < 5.0)
	{
		alpha = 0.0;
	}*/
	
	vec2 chunkd = vec2(mod(gl_FragCoord.x,20.0));
	float dis = distance(vec2(gl_FragCoord.x, gl_FragCoord.y),vec2(320.0,240.0));

	gl_FragColor = vec4(1.0,1.0,1.0,min(gl_FragCoord.y/240.0,1.0));

}
