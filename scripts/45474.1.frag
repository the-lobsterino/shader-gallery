#ifdef GL_ES
precision mediump float;
#endif

//scattering by robobo1221

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define r(x, y) x*y
#define a(x, y) exp2(-r(x,y))
#define d(x) abs(x+1.0e-32)
#define sA(x, y, z) d(a(z, y)-a(x, y))/d((r(z,y)-r(x, y)))

#define gDepth(x) 0.4 / x

#define coeff vec3(0.3, 0.5, 1.0)
#define scatter(x, y, z) sA(x, y, z) * r(x, y)

void main( void ) {

	vec2 position = floor( gl_FragCoord.xy) / (resolution.xy - 0.003);
	
	float depth = gDepth(position.y);
	float depthL = gDepth(mouse.y);
	
	vec3 scatterColor = scatter(depth, coeff, depthL);
	
	vec3 color = vec3(0.0);
	     color = scatterColor * 6.28;
 	     color = color / (color + 1.0);
	
	gl_FragColor = vec4(fract(1234.34576578 * cos((position.x * 14234.1234550 - position.y * 126700.5431230) * time)));

}