#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 cpow(vec2 z, float n){
	float a= atan(z.y,z.x)*n;
	float l=pow(length(z),n);
	return l*vec2(cos(a),sin(a));}
void main( void ) {

	vec2 pos = 4.* ( 2.*gl_FragCoord.xy - resolution.xy )/resolution.x;
float it=0.;
	vec2 z=pos;
	for(int i=0; i<100; i++){
		it++;
		z=cpow(z,10.*sin(time/10.))+pos;
		if (dot(z,z) >= 16.) {
			break;
		}}
	

	gl_FragColor = vec4( vec3(sin(it/10.)), 1.0 );

}