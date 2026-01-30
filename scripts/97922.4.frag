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
    float s=2.6, e;
    for(int i=0;i<3;++i)
      p=mod(p-0.0,2.0)-1.,
      s*=e=(4.0+1.0*sin(time*0.30))/dot(p,p),
      p*=e;
    return length(p.yz)/s;
  }

vec3 normal(vec3 r) {
	vec2 d = vec2(.01, 0.);
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
	vec3 P = vec3(cos(time*.025), time*-0.01325, 1.);
	P.z += time * .01;
	vec3 l = vec3(1.3, 2.3, -.18);
	
	float d;
	float th = 0.0025*abs(sin(time*0.25));
	for(int i=0; i < 24; i++) {
		d = de(P);
		P += d * normalize(r);
		
		if (abs(d) < th) {
			c += dot(normal(P), l);
			c = normal(P) * 1.5;
			//c = vec3(d * 300.);
			break;
		}
	}
	//c += abs(r) * 1.;
	
	gl_FragColor = vec4(c, 1.);

}