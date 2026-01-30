#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float circle(vec2 p) {
  return length(p)* 0.2;
}

float square(vec2 p) {
 return abs(p.x / 0.5) + abs(p.y / 0.5);
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float a = sin(time * 9.0) * 0.5 + 0.5;
	float d = mix(circle(position), square(position), a);

	vec3 color = mix(vec3(0.3,.9,1), vec3(.0,0.0,1.), step(d, 0.8));
	

	gl_FragColor = vec4(color , 1.0);

}