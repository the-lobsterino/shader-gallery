#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define factor 10

void main() {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	vec3 color = vec3(sign(sin(position.x*60. + sin(time))) * sign(sin(position.y*60. + sin(time))));
	
	//for(int i = 1;i<factor;i++) 
	//if(distance(position, mouse) < 0.01 * float(i)+0.01) {
	//	color.x += 0.06 * float(factor);	
	//}
	
	gl_FragColor = vec4(color, 1.0 );

}