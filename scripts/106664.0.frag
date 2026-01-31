#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec4 result = gl_FragColor.rgba;
      result.rgb *= 0.5;
      gl_FragColor = result;

}