#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 res;
	if(gl_FragCoord.y > resolution.y*0.666)
		if(gl_FragCoord.x > resolution.x*.333 && gl_FragCoord.x < resolution.x*.5)
			res = vec3(0.0,0.196,0.6275);
		else
			res = vec3(1.0,1.0, 1.0);
	else if(gl_FragCoord.y > resolution.y*.333)
		res = vec3(0.0,0.196,0.6275);
	else if(gl_FragCoord.x > resolution.x*.333 && gl_FragCoord.x < resolution.x*.5)
		res = vec3(0.0,0.196,0.6275);
	else 
		res = vec3(1.0, 1.0, 1.0);

	gl_FragColor = vec4(res, 1.0 );

}