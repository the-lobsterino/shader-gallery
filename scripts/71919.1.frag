#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float stroke(float x, float s, float w) {
	float d = step(s, x+w*.5) - step(s, x-w*.5);
	return clamp(d, 0.,1.);
}

float circleSDF(vec2 st, vec2 ar) {
	return length(st-.5*ar)*1.;
}

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution;
	vec2 ar = resolution / min(resolution.x, resolution.y);
	
	st *= ar;

	vec3 color = vec3(0.);
	
	color += vec3(stroke(circleSDF(st,ar),.2,.01));

	gl_FragColor = vec4(color, 1.0);

}

// http://glslsandbox.com/e#22343.0