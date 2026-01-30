#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//icing - sphinx
//credit to whoever wrote this
float tri(in float x){return abs(fract(x)-.5);}
vec3 tri3(in vec3 p){return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

vec3 hsv(in float h, in float s, in float v){
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

float triNoise3d(in vec3 p, in float spd)
{
	float z=1.;
	float rz = 0.;
 	vec3 bp = p;
	for (float i=0.; i<2.; i++ )
	{
		vec3 dg = tri3(bp*2.);
		p += (dg+time*spd);
	
		bp *= 1.2;
		z *= 1.5;
		p *= 1.4+rz*.00005;
		
		rz+= (tri(p.z+tri(p.x+tri(p.y))))/z;
		bp += 0.5;
	}
	return rz;
}
vec3 gp = vec3(0.);
vec3 gc = vec3(0.);
float tf(in vec3 p, in float spd, in float f, in float a, in float r)
{
	float n = 0.;
	p -= 1.25;

	for(int i = 0; i < 9; i++)
	{
			n = abs(a-n-triNoise3d(p * f, spd)*a);
			a *= .4;
			f *= 3.;		
			p = mix(p, p.zxy, fract(n-.5)*r*-.0005);
			gc += hsv(length(p), 1., .125);
	}
	
	return n;
}
float capsule( vec3 p, vec3 a, vec3 b, float r )
{
	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	
	return length( pa - ba*h ) - r;
}

vec3 lig_pos = vec3(1.,2.,1.);
vec3 ip = vec3(0.);
vec3 ld = vec3(0.);
float haze = 0.0;
float map(vec3 p) 
{	
	
	float n = tf(p*.125, 0., 1.25, 64., length(p));
	p.yz *= -rmat(1.51);
	float d = length(p) - 0.55+n*.002+pow(n, .1)*.001+n*.0005;
	d = max(d, p.z + d * .1 - mouse.y);
	return d;
}

float map_haze(vec3 p) 
{

	float cn = triNoise3d(p, .1);
	float c = capsule(p,vec3(0.),-lig_pos*32., .5 + cn*.5);
	return abs(c);
}
vec3 calcNormal(vec3 p, float t) {
	vec2 e = vec2(-1.0, 1.0) * 0.05;
	vec3 nor = e.xyy*map_haze(p+e.xyy) + e.yxy*map_haze(p+e.yxy) + e.yyx*map_haze(p+e.yyx) + e.xxx*map_haze(p+e.xxx);
	return normalize(nor);
}


float ambient_occlusion(vec3 p, vec3 n)
{
	float a       = 1.;
	const float r = 2.;
        vec3  op = n * 4. + p;
       	float e  = map(op);
        a 	 += (e-4.);


    return max(0., a);
}


float shadow(vec3 vRay,vec3 vDir,vec3 vLight,float fLight,float fEps)
{
	float fShadow=1.0;

	float fLen=fEps*1.;
	float u_fSoftShadow = 1.5;
	for(int n=0;n<8;n++)
	{
		if(fLen>=fLight) break;

		float fDist=map(vRay+(vLight*fLen));
		if(fDist<fEps) return 1.0;

		if(u_fSoftShadow!=0.0)
			fShadow=min(fShadow,u_fSoftShadow*(fDist/fLen));

		fLen+=fDist;
	}

	return fShadow;
}


vec3 GetSceneNormal( const in vec3 vPos , const in float fDelta)
{
	// tetrahedron normal
	vec3 vOffset1 = vec3( fDelta, -fDelta, -fDelta);
	vec3 vOffset2 = vec3(-fDelta, -fDelta,  fDelta);
	vec3 vOffset3 = vec3(-fDelta,  fDelta, -fDelta);
	vec3 vOffset4 = vec3( fDelta,  fDelta,  fDelta);

	float f1 = map( vPos + vOffset1 );
	float f2 = map( vPos + vOffset2 );
	float f3 = map( vPos + vOffset3 );
	float f4 = map( vPos + vOffset4 );
	
	vec3 vNormal = vOffset1 * f1 + vOffset2 * f2 + vOffset3 * f3 + vOffset4 * f4;

	return normalize( vNormal );
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	
	float tm = sin(time*.5)*3.;//mouse.y * .5+8.+19.*mouse.x;
	
	float pn = floor(p.x*1.);
	//tm *= pn; //split panel view
	
	float t0 = tm * 0.00005;
	float t1 = t0 + 0.01;
	float r0 = 0.5;
	float k = 0.5 + 0.5 * sin(tm * 0.2);
	k = k*k*(3.0 - 2.0*k);
	k = pow(k, 4.0);
	
	float r1 = 0.5 + k * 2.0;
	vec3 ro = vec3(0.0, r1 * cos(t0), r1 * sin(t0));
	
	vec3 ta = vec3(0.0, r0 * cos(t1), r0 * sin(t1));
	vec3 cw = normalize(ta - ro);
	vec3 up = normalize(ro - vec3(0.0));
	vec3 cu = normalize(cross(cw, up));
	vec3 cv = normalize(cross(cu, cw));
	
	vec3 rd = normalize(p.x * cu + p.y * cv + 3.0 * cw);

	if(mouse.x > .5)
	{
		rd.xz *= rmat((mouse.x-.5)*16.);
	}
	
	
	float d = length(rd.xy);
	float e = 0.00001;
	float h = e * 2.0;
	float t = 0.0;
	float s = 0.;


	vec3 pos = vec3(0.);
	vec3 color = vec3(0.);
	float ice = 0.;
	
	
	vec3 lig = normalize(lig_pos-ro);
	float dif = 0.;
	for(int i = 0; i < 128; i++) {
		if(abs(h) < e || t > 8.0) continue;
		pos = ro + rd * t;
		h = map(pos);
		haze += h;
		t += h;
		s++;
		if(h < 0. && s > 16.){h -= h; ice += 1.; color += vec3(.5, .5, .9);}
		e *= 1.05;
	}
	vec3 nor = GetSceneNormal(pos, .00001);
	
	
	float delta = clamp(pow(t, 2.25)*.05, .000001, .0001);
	nor = GetSceneNormal(pos, delta);//calcNormal(pos,t);
		
	dif = clamp(dot(nor, lig), 0.0, 1.0);

	float fre = .125 * clamp(1.0 + dot(nor, rd), 0.0, 1.0);
	float spe = 128.-ice*120.;
	spe = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), spe);
	float sha = shadow(pos, rd, lig_pos, t, e);
	float ao = ambient_occlusion(pos, nor);
		
	color += dif * vec3(.2, .5, .973)  - min(s/128., .15)-d*.1;
	color += spe * 1.5 + fre;
	color *= .5;
	color *= hsv(length(pos*8.+nor*.1)-.9, .25, 1.) + ice * .5 - t*ice*.5;
	color += hsv(length(pos*nor*.5)-.29, .25, 1.)*fre*2.;
	color *= ao*sha*vec3(.9, .8, .8);
	color += s/128.;
	
	if(t>3.)
	{
		color = vec3(.005/d);
	}
	
	gl_FragColor = vec4( vec3(color), 1.0 );
}