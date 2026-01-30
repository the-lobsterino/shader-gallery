#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define res resolution
#define thresh 4.
#define stop 40

vec3 rgb(float c, float f,float o){
	return vec3(sin(o+c),sin(o+c+f),sin(o+c+2.*f))*.5+.5;
}

vec2 cmul(vec2 a, vec2 b){
	return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cdiv(vec2 v1, vec2 v2){
	float a = (v1.x*v2.x+v1.y*v2.y)/(v2.x*v2.x+v2.y*v2.y);
	float b = (v1.y*v2.x-v1.x*v2.y)/(v2.x*v2.x+v2.y*v2.y);
return vec2(a,b);
}

vec3 jf(vec2 z){
	z = cdiv(vec2(.1),z);
	vec2 c = (2.*mouse-1.)*2.;
	int _i;
	for(int i = 0; i < stop; i++){
		z = cmul(z,c-z)+cdiv(c,8.2*z*vec2(mod(time,10.)));
		_i = i;
		if(length(z) > thresh)
			break;
	}
	vec3 col = rgb(log(.9+float(_i)/12.)*2.3, .3, 2.);
	return col;
}

void main( void ) {
	vec2 z = (2.*gl_FragCoord.xy-res.xy)/res.y;
	vec3 col = vec3(0);
	float a = .002;
	float b = .25;
	col += jf(z+vec2(1,0)*a)*b;
	col += jf(z+vec2(0, 0)*a)*b;
	col += jf(z+vec2(0,1)*a)*b;
	col += jf(z+vec2(1,1)*a)*b;
	
	gl_FragColor = vec4(col, 1.0 );

}