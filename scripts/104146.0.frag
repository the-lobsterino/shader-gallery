#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define CH(uv) step(abs(uv.x),0.25)*step(abs(uv.y),0.25)

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;

	float a = radians(time*4.);
	uv *= mat2(sin(a),-cos(a),cos(a),sin(a));
	uv = fract(uv*5.)*0.27;
	float r = CH(uv);
	a = radians(time*64.);
	uv *= mat2(sin(a),-cos(a),cos(a),sin(a));
	float g = CH((0.25-uv*3.+sin(time)/2.));
	
	gl_FragColor = vec4(vec3(0.1,0.2,0.6)*r + vec3(0.2,.5,0.3)*g, 1.0 );

}