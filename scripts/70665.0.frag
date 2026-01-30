precision mediump float;
uniform float time;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))

float dot2( in vec3 v ) { return dot(v,v); }
float udTriangle( vec3 p, vec3 a, vec3 b, vec3 c )
{
	vec3 ba = b - a; vec3 pa = p - a; vec3 cb = c - b; vec3 pb = p - b; vec3 ac = a - c; vec3 pc = p - c;
	vec3 nor = cross( ba, ac );
	return sqrt((sign(dot(cross(ba,nor),pa)) + sign(dot(cross(cb,nor),pb)) + sign(dot(cross(ac,nor),pc))<2.0) ? min( min(dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc) ):dot(nor,pa)*dot(nor,pa)/dot2(nor) );
}
float sdBox( vec3 p, vec3 b )
{
	vec3 q = abs(p) - b;
	return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float map(vec3 p, vec3 b, float e) 
{
	p.xy *= rot(time * 0.5);
	p.xz *= rot(time * 0.5);
	p.yz *= rot(time * 0.5);
	//float tri = udTriangle(p,vec3(0.),vec3(2., 0, 2.),vec3(-0.,-2.,-0.) );
	return max(max(max(sdBox(p, vec3(1.)), -sdBox(p, vec3(1.01, .8, .8))),-sdBox(p, vec3(0.8, 1.01, .8))), -sdBox(p, vec3(0.8, .8, 1.01)));
}
void main( void ) 
{
	vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 1));
	float screenZ = 4.0;
	vec3 p = vec3(0, 0, -screenZ);
	for (int i = 1; i < 50; i++) 
	{
		float d = map(p,vec3(1.),0.1);
		p += rd * d;
		if (d < 0.001) 
		{
			gl_FragColor = vec4(vec3(screenZ / float(i)), 1);
			break;
		}
	}
}