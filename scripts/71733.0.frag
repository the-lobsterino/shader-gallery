#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// varyings? uniforms? need to play with Phaser
float quantizeSteps = 30.; // bigger number = finer grained
vec3 color1 = vec3(.01, 0.02, 0.3);
vec3 color2 = vec3(.05, 0.35, .7);

// TODO: refine with ramp texture for n colors?
// https://stackoverflow.com/questions/47376499/creating-a-gradient-color-in-fragment-shader

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;

	// these mix values create different types of gradient
  	float radialMix = distance(uv,vec2(1.,1.));
	float diagonalMix = (uv.x + uv.y) / 2.;
	float horzMix = uv.x;
	float vertMix = uv.y;
	
	
  	vec3 gradient = mix(color1, color2, vertMix);
	
	// quantized should be a parameterised option really
	vec3 quantized = floor(gradient * quantizeSteps) / quantizeSteps;
	
	gl_FragColor = vec4(quantized, 1.);
}