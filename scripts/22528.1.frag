#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pixel = gl_FragCoord.xy/resolution.xy;
	vec3 color = vec3(pixel,sin(time)+1.);
	vec2 q = pixel-vec2(0.5,0.5);
	pixel.x = sin(time);
	
	float size = sin(time)/100.;
	color += smoothstep(size,size+0.001,abs(q.x)*abs(q.y)/sin(time));
	gl_FragColor = vec4(color,1.0);
}