#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv-=.5;
	uv*=2.0;
	uv.x*=uv.x;
	uv.y*=uv.y;
	float vignette =  smoothstep(1.5,0.5,length(uv));

	gl_FragColor = vec4( vec3(vignette), 1.0 );

}