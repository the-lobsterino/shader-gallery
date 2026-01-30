// made by https://twitter.com/emeen231
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.141592658979
#define TAU PI*2.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 float de(vec3 p){
    float s=3., e;
    for(int i=0;i<12;++i)
      p=mod(p-1.,2.)-1.,
      s*=e=1.7/dot(p,p),
      p*=e;
    return length(p.yz)/s;
  }

vec3 normal(vec3 r) {
	vec2 d = vec2(0.01, 0.);
	return normalize(vec3(
		de(r+d.xyy)-de(r-d.xyy),
		de(r+d.yxy)-de(r-d.yxy),
		de(r+d.yyx)-de(r-d.yyx)
		));
}

void main( void ) {

	vec3 c = vec3(0.);
	vec2 p = (gl_FragCoord.xy-resolution/2.)/resolution.x;
	vec3 r = normalize(vec3(p, 0.2));
	vec3 P = vec3((mouse.xy - .5) * 2., 0.);
	P.z += time * .8;
	vec3 l = vec3(0.3, 0.3, -.8);
	
	float d;
	
	for(int i=0; i < 80; i++) {
		d = de(P);
		P += d * normalize(r);
		if (abs(d) < 0.001) {
			c += dot(normal(P), l);
			c = normal(P) * .5 + .5;
			//c = vec3(d * 300.);
			break;
		}
	}
	//c += abs(r) * 1.;
	
	gl_FragColor = vec4(c, 1.);

}