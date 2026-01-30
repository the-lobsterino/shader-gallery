#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
	CAN SOMEONE TELL ME HOW TO MAKE THE REFLECTION (on the balls) LOOK BIGGER?
*/
struct ray
{
	vec3 origin;
	vec3 direction;
};

struct light
{
	vec3 position;
	vec3 La;
	vec3 Ld;
	vec3 Ls;
};

struct Material
{
	vec3 Ma;
	vec3 Md;
	vec3 Ms;
	float SH;
};

struct plane
{
	vec3 point;
	vec3 normal;
	Material m;
};

struct sphere
{
	vec3 center;
	float radius;
	float radius2;
	Material m;
};

void setScene(out sphere S[2], out plane P, out light L)
{
	S[0].center = vec3(5., 5., 5.);
	S[0].center.y = mix( 2.5, 10.0, abs(sin( time * 2.3 )) * 0.4 );
	S[0].radius = 4.;
	S[0].radius2 = S[0].radius*S[0].radius;
	S[0].m.Ma = vec3(2., .5, 0.5);
	S[0].m.Md = vec3(1., .5, 0.4);
	S[0].m.Ms = vec3(0.6);
	S[0].m.SH = 64.;

	S[1].center = vec3(-5., 3., 5.);
	S[1].center.y = mix( 2.5, 10.0, abs(sin( time  )) * 0.4 );
	S[1].radius = 4.;
	S[1].radius2 = S[1].radius*S[1].radius;
	S[1].m.Ma = vec3(0., .5, 2.5);
	S[1].m.Md = vec3(1., .5, 0.4);
	S[1].m.Ms = vec3(0.6);
	S[1].m.SH = 64.;

	L.position = vec3(1., 100., 100.);
	L.La = vec3(0.1);
	L.Ld = vec3(1.);
	L.Ls = L.Ld;

	P.point = vec3(0., -1., 0.);
	P.normal = vec3(0. ,1., 0.);
	P.m.Ma = vec3(0., .5, 2.5);
	P.m.Md = vec3(1., .5, 0.4);
	P.m.Ms = vec3(0.6);
	P.m.SH = 64.;
}

float intersect_ray_plane(ray R, plane P, out ray hit, out vec3 normal)
{
	float t = dot((P.point - R.origin), P.normal)/dot(R.direction, P.normal);
	hit.origin = R.origin + t*R.direction;
	normal = P.normal;
	hit.direction = reflect(R.direction, normal); 
	return t;
}

float intersect_ray_sphere(ray R, sphere S, out ray hit, out vec3 normal)
{
	vec3 v = R.origin - S.center;
	float B = 2.0*dot(R.direction, v);
	float C = dot(v,v) - S.radius2;
	float B2 = B*B;

	float f = B2 - 4. * C;
	if( f < 0.)
		return 0.;
	float t0 = -B + sqrt(f);
	float t1 = -B - sqrt(f);
	float t =min(max(t0, 0.0), max(t1, 0.0)) * 0.5;
	if(t == 0.)
		return 0.;
	hit.origin = R.origin +t*R.direction;
	normal = normalize(hit.origin - S.center);
	hit.direction = reflect(R.direction, normal);
	return t;
}	

vec3 ADSlight(ray Hit, vec3 normal, Material m, light L)
{
	vec3 col = vec3(0.);
	vec3 lightv = normalize(L.position - Hit.origin);
	vec3 refl = reflect(lightv, normal);
	vec3 amb = m.Ma * L.La;
	vec3 dif = max(0., dot(lightv, normal))*m.Md*L.Ld;
	vec3 spec = vec3(0.);
	float s = dot(lightv, -refl);
	if(s > 0.)
		spec = pow(max(0., s), m.SH)*m.Ms*L.Ls;
	col = amb + dif + spec;
	col = clamp(col, 0.0, 1.);
	return vec3(col);
}

vec3 intersectScene(ray R, sphere S[2], light L, plane P)
{
	vec3 col = vec3(.3);
	ray Hit;
	vec3 norm;
	float t = 1000.;
	float x = t; 
	float p;
	ray Temp;
	vec3 normT;
	float tempT = intersect_ray_sphere(R, S[0], Hit, norm);
	if(tempT > 0.)
	{
		t = tempT;
		col = ADSlight(Hit, norm, S[0].m, L);
		
		 p = intersect_ray_sphere(Hit, S[1], Temp, normT);
		if(p > 0.)
		{
			x = p;
			col *= ADSlight(Temp, normT, S[1].m, L);
		} 
		p = intersect_ray_plane(Hit, P, Temp, normT);
		if(p > 0. && p < x)
		{
			x = p;
			col *=ADSlight(Temp, normT, P.m, L);
		} 
	} 
	tempT = intersect_ray_sphere(R, S[1], Hit, norm);
	if(tempT >0. && tempT < t)
	{
		t = tempT;
		col = ADSlight(Hit, norm, S[1].m, L);
		p = intersect_ray_sphere(Hit, S[0], Temp, normT);
		if(p > 0. && p < x)
		{
			x = p;
			col *=ADSlight(Temp, normT, S[0].m, L);
		}
		p = intersect_ray_plane(Hit, P, Temp, normT);
		if(p > 0. && p < x)
		{
			x = p;
			col *=ADSlight(Temp, normT, P.m, L);
		} 
		
	}
	tempT = intersect_ray_plane(R, P, Hit, norm);
	if(tempT > 0. && tempT < t)
	{
		t = tempT;
		col = ADSlight(Hit, norm, P.m, L);
		p = intersect_ray_sphere(Hit, S[0], Temp, normT);
		if(p > 0. && p < x)
		{
			x = p;
			col *= ADSlight(Temp, normT, S[0].m, L);
		}
		p = intersect_ray_sphere(Hit, S[1], Temp, normT);
		if(p > 0. && p < x)
		{
			x = p;
			col *= ADSlight(Temp, normT, S[1].m, L);
		}
	}
	return col;
}

void main()
{
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	uv = 2.*uv - 1.;
	uv.x *= resolution.x/resolution.y;

	float fov = 30.;
	float kfov = 1./tan(radians(fov));
	ray R;
	R.origin = vec3(0., 1., 20.);
	R.direction = normalize(vec3(uv, -kfov));

	sphere S[2];
	light L;
	plane P;
	setScene(S,P, L);
	
	vec3 col = intersectScene(R, S, L, P);
			
	gl_FragColor = vec4(col , 1.);
}
