#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x*=resolution.x/resolution.y;

	float a = clamp(uv.x*uv.x*pow(distance(uv,vec2(sin(time)*.2+.1,.5)),asin(uv.x-1.)*2.),.3,1.);																					 
	
	gl_FragColor = vec4(a,a*sin(uv.y*tan(time*.1)*.5),0,1);
}