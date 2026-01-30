#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
const float blurriness = 0.0625;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
float dist(vec2 p){
return sqrt(p.x*p.x+p.y*p.y);
}
void main( void ) {

	vec3 color = vec3(0,0,0);
	float dis = dist((gl_FragCoord.xy-mouse.xy*resolution.xy));
	
	float grad = (sin(100.0/dis+time)+1.0)/2.0;
	color = vec3(grad,1.0-grad,1.0);
	gl_FragColor = vec4(color, 1.0 )*blurriness+(texture2D(backbuffer,gl_FragCoord.xy/resolution))*(1.0-blurriness);

}