#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 vUv = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float o = fract(time/2.);
	float length = .2;
	if(vUv.x>o && vUv.x<o+length && vUv.y>.5){
		discard;
	
	}
	
	if(vUv.x<1.-o && vUv.x > 1.-(o+length) && vUv.y<=.5){
	 discard;	
	}

	gl_FragColor = vec4( 1.0 );
}