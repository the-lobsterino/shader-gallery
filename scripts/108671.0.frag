#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

        float s1 = step(uv.x,.5) - step(uv.y,.5);
	float s2 = step(.5,uv.x) - step(uv.y,.5);
	float s3 = step(uv.x,.5) - step(.5,uv.y);
	float s4 = step(.5,uv.x) - step(.5,uv.y);
	
	vec4 result = vec4(s3+s1,s2,s4+s3,1.);
	
	result.r += sin(time);
	result.g += cos(time*1.2);

	result.a += tan(time*.1);
	
	gl_FragColor = result;


}