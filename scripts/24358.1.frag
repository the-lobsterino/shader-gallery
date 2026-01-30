#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tri(in float x){return abs(fract(x)-.5);}
vec3 tri3(in vec3 p){return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));}
                                 
mat2 m2 = mat2(0.970,  0.242, -0.242,  0.970);

float triNoise3d(in vec3 p, in float spd)
{
	float z=1.4;
	float rz = 0.;
 	vec3 bp = p*2.2;
	for (float i=0.; i<=3.; i++ )
	{
		vec3 dg = tri3(bp*2.);
		p += (dg+time*spd);
	
		bp *= 1.8;
		z *= 1.5;
		p *= 1.2;
		//p.xz*= m2;
		
		rz+= (tri(p.z+tri(p.x+tri(p.y))))/z;
		bp += 0.14;
	}
	return rz;
}
float map(vec3 p) {
	p.y *= 1.0;
	float d = length(p) - 0.5 + 0.02 * triNoise3d(p, 0.01);
	return d;
}

vec3 calcNormal(vec3 p) {
	vec2 e = vec2(-1.0, 1.0) * 0.0001;
	vec3 nor = e.xyy*map(p+e.xyy) + e.yxy*map(p+e.yxy) + e.yyx*map(p+e.yyx) + e.xxx*map(p+e.xxx);
	return normalize(nor);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	vec2 ms = mouse * 2.0 - 1.0;
	ms.x *= resolution.x / resolution.y;
	float color = 0.0;
	float d = length(p);
	
	vec3 ro = vec3(0.0, 0.0, 1.6);
	vec3 rd = normalize(vec3(p.x, p.y, -3.0));
	float e = 0.0001;
	float h = e * 2.0;
	float t = 0.0;
	for(int i = 0; i < 60; i++) {
		if(abs(h) < e || t > 20.0) continue;
		h = map(ro + rd * t);
		t += h;
	}
	vec3 pos = ro + rd * t;
	vec3 nor = calcNormal(pos);
	vec3 lig = normalize(vec3(1.0));
	float dif = clamp(dot(nor, lig), 0.0, 1.0);
	float fre = clamp(1.0 + dot(nor, rd), 0.0, 1.0);
	float spe = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 32.0);
	
	
	vec3 scolor = vec3(.2,.5,.7);
	gl_FragColor = vec4( pow(nor, vec3(4.))*vec3(0,0,1)*vec3(.0,.66,.44)+7.*length(pow(nor, vec3(11.))*vec3(0,1,0))+dif*1e-1*vec3(.2,.8,.1)+pow(scolor*fre, vec3(1.3)) + spe*4.*vec3(.9,.67,.25), 1.0 );
	
	if(t > 20.0) gl_FragColor.rgb = 1.5*pow(scolor / d, vec3(1.765));
	
	

}