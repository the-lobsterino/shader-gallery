#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	float d = smoothstep(.5,.3,distance(vec2(.5),uv));
	uv.y += .725;
	float l = step(.95,fract(uv.y*10.));
	
	gl_FragColor = vec4(d*uv.y,l,d,1.);

}