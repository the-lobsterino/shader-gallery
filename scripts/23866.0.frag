#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdDisc(vec2 p, float r){
	return length(p) - r;
}

float sdStrippedDisc(vec2 p, float r, float amount, float off){
	vec2 polar = vec2(length(p), atan(p.y, p.x));
	return max(polar.x - r, step(1., mod((polar.y+off)*amount/PI, 2.)));
}

float sdBox(vec2 p, vec2 b){
  vec2 d = abs(p) - b;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

void main( void ) {

	vec2 p =  gl_FragCoord.xy / resolution.xy;
	p-=vec2(.5);
	p.x*=resolution.x/resolution.y;
	p*=2.;
	p.x+=cos(p.y*20.+time*4.)*.01;
	
	vec2 polar = vec2(length(p), atan(p.y, p.x));
	polar.y+=cos(time*.1)*2.*PI;
	polar.y+=cos(time*.5)*polar.x*5.;
	
	p = vec2(cos(polar.y)*polar.x, sin(polar.y)*polar.x);
	
	vec3 color = vec3(0.);
	
	color = mix(color, vec3(0., 0., 1.), step(0., -sdDisc(p, 1.)));
	color = mix(color, vec3(.9, 0., 0.), step(0., -sdDisc(p, .975)));
	
	color = mix(color, vec3(1., 1., 1.), step(0., -sdStrippedDisc(p, .95, 4., PI/8.)));
	color = mix(color, vec3(.9, 0., 0.), step(0., -sdDisc(p, .8)));
	
	color = mix(color, vec3(1., .95, 0.), step(0., -sdDisc(p, .75)));
	
	color = mix(color, vec3(0., 0., 1.), step(0., -sdStrippedDisc(p, .775, 100., 0.)));
	color = mix(color, vec3(1., .95, 0.), step(0., -sdDisc(p, .725)));
	
	color = mix(color, vec3(1., 1., 1.), step(0., -sdBox(p - vec2(0., -.5), vec2(.5, .075))));
	
	
	
	
	gl_FragColor = vec4(  color , 1.0 );

}