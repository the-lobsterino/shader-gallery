#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = gl_FragCoord.xy;
	vec2 pos = gl_FragCoord.xy/resolution.xy;

	vec3 color = vec3(0.);
	
	if(fract(p.x/2.)<.6 && fract(p.y/2.)>.4) color.r=1.0;
	if(fract(p.x/2.)<.6 ^^ fract(p.y/2.)>.4) color.g=sqrt(.5);
	if(fract(p.x/2.)>.6 && fract(p.y/2.)<.6) color.b=1.0;

	color=vec3(10.0,0.,.9);
	
	float f=fract(p.x/2.+sin(pos.y*10.0*mouse.x));
	color*=f;
//	if (pos.x>.5) color.r=1.0;
	
	
	gl_FragColor = vec4(  color, 1.0 );

}