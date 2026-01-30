#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 circle(vec2 p, float size) {
  return vec2(length(p), size);
}

float rect(vec2 p, vec2 size) {  
  vec2 d = abs(p) - size;
  return min(max(d.x, d.y), 0.0) + length(max(d,0.0));
}

vec2 morphing(vec2 p) {
	float t = time / 2.;
	
	return mix(circle(p, .5), vec2(rect(p, vec2(.5)), .01), abs(sin(t)));
}

vec3 getColor(float shape) {
	return mix(vec3(1), vec3(0), shape);
}

float shape(vec2 st) {
	return step(st.x, st.y);
}

//http://thndl.com/square-shaped-shaders.html
float polygon(vec2 p, int vertices, float size) {
    float a = atan(p.x, p.y);
    float b = 6.28319 / float(vertices);
    return cos(floor(0.5 + a / b) * b - a) * length(p) - size;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 st = gl_FragCoord.xy/resolution * 2.  - 1.;
	st = st * (resolution / min(resolution.x, resolution.y));

	// vec2 d = morphing(p);
	
	float sqST = shape(1. - vec2(rect(st, vec2(.5)), .01));
	float cST = shape(1. - circle(st + vec2(1.3, 0.), 1.));
	vec2 cST2 = 1. - circle(p + vec2(-1.35, 0.), 1.);
	
	
	vec3 color = getColor(1. - (cST - sqST));
	gl_FragColor = vec4( color, 1.0 );
}