#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.y*=resolution.y/resolution.x;
	float d = smoothstep(.25,.23,distance(vec2(.50),uv));
	
	float l = step(.05,fract(uv.y*4.));
	l*=uv.y+d;
	if(uv.y>0.)gl_FragColor = vec4(d*l,d*l*uv.y,0.,1.);

}