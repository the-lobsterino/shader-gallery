

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//green line is dot product (+ and - y axis)
//red line is direction from origin to mouse and vice versa
//blue line is a 2d cross product thing

float line(vec2 p, vec2 a, vec2 b, float w)
{
	vec2 q		= b - a;	
	float u 	= dot(p - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return dot(1./(distance(p, mix(a, b, u))), w);
}


vec2 cross(vec2 a, vec2 b) //???? - whats the best cross product analog for 2d? hrrm (orthogonalization of a vector is vec2(-v.y, v.x))
{
	return vec2(a.xy-b.xy).yx * vec2(-1., 1.);
}


float hash(float x)
{
	return fract(sin(x)*1234.5678-fract(x*1234.5678));	
}

void main( void ) {
	
	vec2 uv 	= gl_FragCoord.xy /resolution.xy;
	vec2 a		= resolution/min(resolution.x, resolution.y);
	float s		= 8.;
	vec2 p		= (uv - .5) * a * s;
	vec2 m		= (mouse - .5) * a * s;	
	vec2 o		= vec2(0., 0.);
	vec2 d		= vec2(8., 8.) * vec2(hash(floor(time*.125))-.5, hash(floor(-time*.125))-.5);
	
	
	vec2 o_to_m 	= normalize(m-o);
	vec2 d_to_m 	= (m-d);
	vec2 d_to_o 	= normalize(o-d);
	
	float dot_dm 	= dot(o_to_m, d_to_m);
	vec2 cross_dm	= cross(o_to_m, d_to_m);
	
	float w		= s * .5/min(resolution.x, resolution.y);
	
	float l_o_to_m	= line(p, o, o_to_m, w);
	float l_d_to_m	= line(p-d, o, normalize(d_to_m), w);
	float l_m_to_d	= line(p-m, o, normalize(-d_to_m), w);
	float l_d_to_o	= line(p-d, o, d_to_o * length(o-d), w);
	float l_m_to_o	= line(p-m, o, normalize(-o_to_m), w);
	
	float l_dot	= line(p, o, normalize(vec2(0., dot_dm)), w);
	float l_cross	= line(p, o, normalize(cross_dm), w);
	 ;
	
	vec4 r		= vec4(0., 0., 0., 1.);	
	r.x		+= l_o_to_m;
	r.xy		+= l_m_to_o;
	r.zy		+= l_d_to_m;	
	r.y		+= l_dot;
	r.z		+= l_cross;
	r.zy		+= l_m_to_d;
	r.xy		+= l_d_to_o;
	
	gl_FragColor 	= r;
}//sphinx