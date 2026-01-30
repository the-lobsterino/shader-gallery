#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;
	vec2 position=vec2(gl_FragCoord.x-resolution.x/2.0,gl_FragCoord.y-resolution.y/2.0)*2.0/min(resolution.x,resolution.y);

	float color = 0.01;
	
	if((position.x*position.x+position.y*position.y)<0.5){
		gl_FragColor=vec4(1,0,0,1);
	}else{
		gl_FragColor=vec4(1,1,1,1);
	}

}