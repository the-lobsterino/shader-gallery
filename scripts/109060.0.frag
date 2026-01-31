precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float color = 0.0;
	vec2 pos = (gl_FragCoord.xy / resolution);
	vec2 col = (pos);
	gl_FragColor=vec4(col,(sin(time)+1./2.),1);
}