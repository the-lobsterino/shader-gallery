/*Ziad 12 / 09 / 2018*/
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 m =mat2(0.8,0.6, -0.6, 0.8);

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 p){
	float f=.0;
	f+= .5000*noise(p); p*= m*2.02;
	f+= .2500*noise(p); p*= m*2.03;
	f+= .1250*noise(p); p*= m*2.01;
	f+= .0625*noise(p); p*= m*2.04;
	
	f/= 0.9375;
	
	return f;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}
	
float opTwist( vec3 p )
{
    float c = cos(2.0*p.y);
    float s = sin(2.0*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return sdTorus(q,vec2(0.2,.4));
}

float map(vec3 p){
	vec3 q=1.- (atan((p))); 
	q.xz -= smoothstep(.5,.2,fbm(p.xz*6.));
	float d=0.;
	for(int i=0;i<23;i++){
		d+=cos(opTwist(q));
	}
	return d;
	
}

float trace(vec3 o, vec3 r){
	float t=0.0;
	for(int i=0;i<32;i++){
		vec3 p= o +r*t;
	       float flicker = tan( mod(time*.3,.45) / sin(time*1.2) );
		float d=atan(map(p));
		t-= d*flicker;
	}
	return t;
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv =uv *2. -1.;
	vec3 r=normalize(vec3(uv,1.));
	float the =time*0.1;
	r.xz *= mat2(cos(the),-sin(the),cos(the),sin(the));
	vec3 ro= vec3(0.,0.,time);
	float t= trace(ro,r);
	
	float fog=1. /(1.+t*t*0.1);

	gl_FragColor = vec4(fog*0.7,fog*0.1,fog,fog);

}