#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = 3.14159265;

mat2 genRot(float v){
	return mat2(cos(v),-sin(v),sin(v),cos(v));
}

float map(vec3 p){
	p.xz *= genRot(time * PI/5.5);
	p.xy *= genRot(time * PI/5.5);
	vec3 q = abs(p);
	float c = max(q.x,max(q.y,q.z)) - 0.5;
	return c;
}

vec3 trace(vec3 o,vec3 r){
	vec4 d;
	float t = 0.;
	for(int i = 0; i < 36; i++){
		vec3 p = o + r * t;
		float d = map(p);
		t += d * 0.5;
	}
	vec3 p = o + r * t;
	return vec3(p*-0.6+t*0.2);
}

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy * 2.- resolution.xy) / resolution.y;
	vec3 o = vec3(0.,0.,-1.8); // cam
	vec3 r = normalize(vec3(uv,1.5)); // ray
	vec3 d = trace(o,r);
	gl_FragColor = vec4( vec3(dot(r,d.xyz)), 1.0 );

}