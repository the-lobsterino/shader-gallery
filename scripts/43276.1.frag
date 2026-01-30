#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

mat2 rot(float a){
	float c = cos(a),
		s = sin(a);
	return mat2(c, s, -s, c);
}

float map(vec3 p){
	p += sin(p)* 0.2;
	p += dot(p.xy,rot(time)*vec2(0,0.5))*0.3;
	p.xy *= rot(time);
	p.yz *= rot(time);
	p = mod(p + 2.5, 5.) - 2.5;
	return sdTorus(p, vec2(0.5,0.2));//length(p) - 1.;
}

float blop2(vec3 p){
	return time+p.x+p.y+p.z;
}

float blop(vec3 p){
	return (sin(blop2(p))+cos(blop2(p)*2.)+sin(blop2(p)*4.)+cos(blop2(p)*8.))/4.;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position -= 0.5;
	position.x *= resolution.x / resolution.y;
	
	vec3 ro = vec3(0, 0, -3.5), //Camera origin (ray origin)
		rd = normalize(vec3(position, 1.)), //ray direction
		mp = ro; //marching point
	
	float ff;
	for(float f = 0.; f < 30.; ++f){
		ff = f;
		float d = map(mp);
		if(abs(d) < .01)
			break;
		mp += rd * d;
	}
	
	float c1 = 1. - ff / (30. * (0.1+abs(blop(vec3(ff,ff,ff))*0.9)));
	float c2 = ff / 90.;
	float c3 = ff / 60.;
	
	gl_FragColor = vec4( c1, c2, mp.z/20., 1. );
}