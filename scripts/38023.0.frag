#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 n) {
  //This is just a compounded expression to simulate a random number based on a seed given as n
  	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
  //Uses the rand function to generate noise
	  const vec2 d = vec2(0.0, 1.0);
	  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float stepper = time;
	float color = noise(gl_FragCoord.xy/50. - stepper) ;// + (1. - gl_FragCoord.y / (resolution.y / 1.4));
	color -= noise(gl_FragCoord.xy/50.) / 2.;
	color -= noise(gl_FragCoord.xy /100.) / 2.;
	color *= 1000.;
	color *= 1. - gl_FragCoord.y / resolution.y;
	gl_FragColor = vec4( vec3( color, color , color), 1.0 );

}