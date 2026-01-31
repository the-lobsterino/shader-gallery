#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415926;

vec3 idw(vec2 p, vec2 q, vec2 v)
{
	vec2 diff = p - q;
	float d2 = dot(diff, diff);
	float id2 = 1.0 / d2;
	return vec3(v * id2, id2);
}

vec3 nc(vec2 v, vec2 q){
	vec2 n = normalize(v);
	return idw(n *0.35 + 0.5,q,n);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	
	vec3 vfa = vec3(0.0);
	
	const int steps=16;
	for(int i = 0; i < steps; i++)
	{
		float l = float(i) / float(steps) * 2.0 * PI;
		vfa += nc(vec2(sin(l), cos(l)), p);
	}

	
	vec2 vf = vfa.xy / vfa.z;

	gl_FragColor = vec4(vec2(vf*0.5+0.5), 0.5, 1.0 );

}