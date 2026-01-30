#extension GL_OES_standard_derivatives : enable

precision mediump float;
#define pi acos(-1.)
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 cpolar( float k , float t ){  return k*vec2(cos(t),sin(t));}
vec2 cconj( vec2 z )  { return vec2( z.x , -z.y ); }
vec2 cmul( vec2 a, vec2 b )  { return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x ); }
vec2 csquared( vec2 a )  { return vec2( a.x*a.x - a.y*a.y, 2.*a.x*a.y ); }
vec2 cexp( vec2 z ) { return cpolar(exp(z.x) , z.y ); }
vec2 clog( vec2 z ) { return vec2( log(length(z)) , atan(z.y , z.x) ); }
vec2 cdiv( vec2 a, vec2 b )  { float d = dot(b,b); return vec2( dot(a,b), a.y*b.x - a.x*b.y ) / d; }
vec2 cpow(vec2 c, float n){
float a = atan(c.y,c.x)*n;
float l = pow(length(c),n);
	return l*vec2(cos(a),sin(a));}
mat2 rot(float ang){
	float c = cos(ang);
	float s = sin(ang);
	return mat2(c,-s,s,c);}
void main( void ) {

	vec2 position = 5.*( 2.*gl_FragCoord.xy - resolution.xy )/resolution.x;
	vec2 z = position;
	float it = 1e8;
	float zata = 0.;
	float pzata = 0.;
	float a =0.;
	float n = time/acos(-1.)/2.;
	for(int I = 0;I<200;I++){
		vec2 pz=  z;
		z*=rot(-n);
		
					
				
			z=cmul(cpow(z,2.),cexp(cdiv(vec2(1.,0.),z)))+position;

		a++;
		pzata=zata;
		zata+=sin(atan(z.x,z.y))*.5 + .5;;

		it =mix(pzata/(a-1.),zata/a,clamp(-log2(log(length(z))/log(1e20)), 0. , 1.));
	//z = z-cdiv(cpow(z,n)-vec2(1.,0.),cmul(vec2(n,0.),cpow(z,n-1.)))+position
		//if(abs(dot(z-pz,z-pz))<=0.001){
		if(dot(z,z)>=1e20){
			break;}}
	gl_FragColor = vec4( vec3(0.5+cos(it*pi*4./2.+pi*2.)*cos((it*pi*2.+vec3(pi*0.2,pi*0.4,pi*0.6)))), 1. );

}