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
 

	
	if(gl_FragCoord.y > resolution.y*0.5)
		if(gl_FragCoord.x > resolution.x*.333 && gl_FragCoord.x < resolution.x*.4)
			col = vec3(.9,.7,0.1);
		else
			col = vec3(0.2,0.1,.6);
	else if(gl_FragCoord.y > resolution.y*.333)
		col = vec3(.9,.7,0.1);
	else if(gl_FragCoord.x > resolution.x*.333 && gl_FragCoord.x < resolution.x*.4)
		col = vec3(.9,.7,0.1);
	else 
		col = vec3(0.2,0.1,.6);
		
		col += w * .3;

	gl_FragColor = vec4(col, 1.0 );

}