#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Via http://www.ecma-international.org/publications/files/ECMA-TR/TR-098.pdf
vec3 RGB2YCbCr(vec3 inp){
	return vec3(
		dot(inp, vec3(.299, .587, .114))
	 ,	dot(inp, vec3(-.1687, -.3313, .5))+0.5
	 ,	dot(inp, vec3(.5, -.4187, -.0813))+0.5
	);
}
vec3 YCbCr2RGB(vec3 inp){
	inp += vec3(0., -0.5, -0.5);
	return vec3(
		dot(inp, vec3(1., .0, 1.4))
	 ,	dot(inp, vec3(1., -.34414, -.71414))
	 ,	dot(inp, vec3(1., 1.772, .0))
	);
}
//endVia

vec3 colorTx(vec3 inp){
	vec3 asYCC = RGB2YCbCr(inp);
	
	
	float txModeCt = 10.;
	float txModeRt = 4.0;
	float txModePhase = fract(txModeRt * time / txModeCt);
	
	if(txModePhase < 1./txModeCt) asYCC.x *= asYCC.x;
	else if(txModePhase < 2./txModeCt) asYCC.y *= asYCC.y;
	else if(txModePhase < 3./txModeCt) asYCC.z *= asYCC.z;
	else if(txModePhase < 4./txModeCt) asYCC.x *= asYCC.y;
	else if(txModePhase < 5./txModeCt) asYCC.y *= asYCC.z;
	else if(txModePhase < 6./txModeCt) asYCC.z *= asYCC.x;
	else if(txModePhase < 7./txModeCt) asYCC.x *= asYCC.z;
	else if(txModePhase < 8./txModeCt) asYCC.y *= asYCC.x;
	else if(txModePhase < 9./txModeCt) asYCC.z *= asYCC.y;
	
	
	return YCbCr2RGB(asYCC);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	vec3 color3 = vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 );
	if( position.x > 0.5){
		color3 = colorTx(color3);
	}
	gl_FragColor = vec4( color3, 1.0 );

}