#ifdef GL_ES
precision mediump float;
#endif

//Grapefruit of justice. @mattdesl Feb 28, 2014
//Best viewed on max resolution
//Prototyping for js1k-webgl

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float T = time;
	
	vec2 fc = gl_FragCoord.xy;
	vec2 p = fc/resolution.xy;
	p.x*=resolution.x/resolution.y;
	
	float r = length(p*2.-1.);
	p -= .5;
	
	float theta = atan(p.y, p.x);
	float mask = smoothstep(.7, .69, r);
	float center = smoothstep(.95, .85, 1.-r);
	float modo = sin(r*5.6+sin(T*2.)*.1);
	
	float c = smoothstep(.5, .2, (sin(6.*theta+T)/2.+.5)*10.0 * center*modo);
	
	vec3 color = mix(vec3(.4,.1,.1), vec3(.7), mask*c);
	vec3 inner = mix(vec3(.2), vec3(.6, .4, .3), smoothstep(1.2, .5, r));
	color = mix(color, inner, r);

	//some noise
	color += fract(sin(dot(p, vec2(12.9,78.2))) * 43758.5)*.05;
	
	//scanlines
	if (mod( fc.x+fc.y, 6.0 ) > 2. )
		color *= 0.9;

	gl_FragColor = vec4(color, 1.);
}