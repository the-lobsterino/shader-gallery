#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 col;
void main( void ) {
	const float PI = 3.1415926535;
vec2 uv = (gl_FragCoord.xy*2.-resolution.xy)/resolution.y+0.00;
	
	float w = sin((uv.x + uv.y - time * .5 + sin(1.5 * uv.x + 4.5 * uv.y) * PI * .3) * PI * .6); 
 

	
	if(gl_FragCoord.y > resolution.y*0.666)
		if(gl_FragCoord.x > resolution.x*.333 && gl_FragCoord.x < resolution.x*.5)
			col = vec3(1,1,1);
		else
			col = vec3(1.0,0.0,0.0);
	else if(gl_FragCoord.y > resolution.y*.333)
		col = vec3(1,1,1);
	else if(gl_FragCoord.x > resolution.x*.333 && gl_FragCoord.x < resolution.x*.5)
		col = vec3(1,1,1);
	else 
		col = vec3(1.0,0.0,0.0);
		
		col += w * .3;

	gl_FragColor = vec4(col, 1.0 );

}