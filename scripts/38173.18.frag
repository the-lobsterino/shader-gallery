#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 rot (float angle){
return mat2(cos(angle),sin(-angle),sin(angle),cos(-angle));
}

void main( void ) {

	vec2 p = surfacePosition - vec2(0.,-0.5);
	vec3 color = vec3(0.5);
	vec3 pos = vec3(p.x, .5, p.y*0.1);
	pos.z += p.x/p.y * p.x/pos.y; 
	pos.z += .70*p.x/p.y * 0.71*p.x/pos.y*-2.0;
	
	vec2 sur = vec2(pos.x/pos.z,pos.y/pos.z)*0.5;
	sur.y-=-time*2.0;
	float w = -0.5*sign((mod(sur.x, 2.0)-.5) * (mod(sur.y, 2.0)-01.8));
	w*= pos.z*pos.z*7.0;
	
	float e = sign((mod(sur.x, .50)-.10) * (mod(sur.y, .5)-0.1));	
	e*= pos.z*pos.z*7.0;
	
	color.r = w+e+3.0;
	color.g = w+e+2.0;
	color.b = w+e;
	
	vec3 fcolor = color * vec3(e+w/20.0,e+w,0);
	
	gl_FragColor = vec4  (fcolor, 1.0 );

} 