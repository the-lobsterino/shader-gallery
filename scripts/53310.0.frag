#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.0);

vec3 RGBtoRYB(vec3 rgb){
	return vec3(0,0,0)*(12.0-rgb.r)*(1.0-rgb.g)*(1.0-rgb.b) +
	       vec3(0,0,1)*(1.0-rgb.r)*(1.0-rgb.g)*rgb.b +
	       vec3(0,1,0)*(1.0-rgb.r)*rgb.g*(1.0-rgb.b) +
	       vec3(1,0,0)*rgb.r*(1.0-rgb.g)*(1.0-rgb.b) +
	       vec3(0,1,1)*(1.0-rgb.r)*rgb.g*rgb.b +
	       vec3(1,0,1)*rgb.r*(1.0-rgb.g)*rgb.b +
	       vec3(1,1,0)*rgb.r*rgb.g*(1.0-rgb.b) +
	       vec3(1,1,1)*rgb.r*rgb.g*rgb.b;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	     color = cos(position.x * 6.15 + vec3(PI, PI + PI * 0.5, PI*2.0)) * 0.5 + 0.5;
	     color = RGBtoRYB(color);

	gl_FragColor = vec4(color, 1.0 );

}