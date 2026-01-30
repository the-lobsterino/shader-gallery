/*

Minimal effect

Cafeoh @cafeohio
cafe.ohio@gmail.com
3d.cafeoh.net

*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float g(vec2 p){
	return sin(sin(p.y)*p.x*10.+time);
	return sin(p.x*10.*p.y+time);
}

float f(vec2 p){
	float cut=sin(p.x+time*1.1)*10.+cos(p.y+time*1.567)*10.+20.;
	vec2 fl = floor(p*cut)/cut;
	float d = length(p-(fl+0.5/cut));
	float thres=g(p);
	
	return step(d,thres/cut);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	position.x*=resolution.x/resolution.y;

	float color = f(position);
	
	gl_FragColor = vec4( vec3( color , 0.8 , step(sin(cos(position.y)*position.x*10.+time),0.5) ), 1.0 );
}