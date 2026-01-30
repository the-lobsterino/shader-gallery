// co3moz - xx

precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

#define t(k) texture2D(backbuffer, k).xyz

void main( void ) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = gl_FragCoord.xy / resolution.xy * aspect;
	vec3 color = vec3(0.0);
	vec2 center = 0.5 * aspect;
	color = t(position / aspect + vec2(0.01 + sin(time) * 0.01, 0.01 + cos(time) * 0.01) * sign(center - position));
	
	if(length(step(sin(position * 100.0), vec2(0.5))) < 0.5) color = vec3(sin(time), sin(time + 2.04), sin(time + 2.08)) * 0.5 + 0.5 +  vec3(color.g, color.b, color.r);
	
	gl_FragColor = vec4(color, 1.0);
}