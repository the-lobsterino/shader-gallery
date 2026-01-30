#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(.998,15.233))) * 428.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 pos = mod(position, 5.0);
	float a = rand(pos * mod(time,10.0));
	
	gl_FragColor = vec4(a, a, a, .0001);//rand(position * sin(time/100.0)), 1.0, 1.0);//sin(pos.x), .0);
}