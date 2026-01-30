#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//Inigo Quilez
//https://www.youtube.com/watch?v=0ifChJ0nJfM

float fun(float x){
  //return cos(x);
  return abs(mod(x, 6.0) - 3.0)/2. - 1.;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );// *20.0 - 10.0;
	//pos.y *= resolution.y/ resolution.x;
	
	vec2 q = pos - vec2(0.34, 0.7);
	
	vec3 color = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 0.8, 0.3), sqrt(pos.y));
	
	float r = 0.2 + 0.1 * fun(atan(q.y, q.x) * 10.0 + q.x*20.0 + 1.0+0.20*sin(time));
	color *= smoothstep(r, r+0.01, length( q ));
	
	r = 0.015;
	r += 0.002 * cos(q.y * 120.0);
	r += exp(-62. * pos.y);
	color *= 1.0 - (1.0 - smoothstep(r, r+0.001, abs( q.x -sin(2.0 *q.y-0.02*sin(time)) * 0.2 ))) * ( 1.0 - smoothstep(0.0, 0.01, q.y));
	
	gl_FragColor = vec4( color , 1.0 );
}