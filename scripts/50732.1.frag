#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 newUv = uv;
	vec2 projPos;
	projPos = uv;
	projPos.x = uv.x/(uv.y-0.177);
	projPos.y = 10.0/(uv.y-0.177);
	if(uv.y < 0.2){
		newUv.y = 0.2 + (0.2 - newUv.y);
		       
	 }
	if(uv.y < 0.177) newUv.x += sin(projPos.y/80.0 + time)/20.0;
	float color = 0.0;
	color += sin( newUv.x * cos( time / 15.0 ) * 80.0 ) + cos( newUv.y * cos( time / 15.0 ) * 10.0 );
	color += sin( newUv.y * sin( time / 10.0 ) * 40.0 ) + cos( newUv.x * sin( time / 25.0 ) * 40.0 );
	color += sin( newUv.x * sin( time / 5.0 ) * 10.0 ) + sin( newUv.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	//if(sin(projPos.y/12.0)/2.0 - projPos.x < 0.1) gl_FragColor = vec4(1.0,1.0,1.0,1.0);

}