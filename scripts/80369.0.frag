#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 res;
	vec2 uv =gl_FragCoord.xy / resolution.xy;
		
	if(uv.y >  0.667)
		res = vec3(1.0,0.0, 0.0);
	else if(uv.y >  0.334)
		res = vec3(1.0,1.0,1.0);
	else 
		res = vec3(0.0, 0.5, 0.0);

	gl_FragColor = vec4(res, 1.0 );
	gl_FragColor += floor(uv.y - fract(dot(gl_FragCoord.xy,    0.05*vec2(0.75-sin(time*0.5), 0.75+sin(time*0.5)))) * 5.0) * 0.05;  

}