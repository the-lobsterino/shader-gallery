#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 st = gl_FragCoord.xy/resolution.xy;

  	vec3 color1 = vec3(1.9,0.55,0);
  	vec3 color2 = vec3(0.226,0.000,0.615);

  	float mixValue = distance(st,vec2(0,1));
  	vec3 color = mix(color1,color2,mixValue);

  	gl_FragColor = vec4(color,mixValue);
}
