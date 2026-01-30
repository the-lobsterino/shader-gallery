#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

const float scale0 = .2;
const float scale_mul = .8;
const int map_iterc = 6;
const float thickness = .6;


const int rm_main_iterc = 130;

const int rm_shadow_iterc = 50;
const float rm_shadow_distmul = .3;
const float rm_shadow_eps = .001;

const float shadow_sharpness = .5;
const float shadow_narrowing_comp = .1;
const float shadow_narrowing_disp = .1;

const float camera_distance = .6;

#define PLANE
#define SHADOW



mat3 rotate3x(float angle) {
	return mat3(
		 1., 0., 0.
		,0.,  cos(angle),  sin(angle)
		,0., -sin(angle),  cos(angle)
	);
}

mat3 rotate3y(float angle) {
	return mat3(
		   cos(angle), 0.,  sin(angle)
		,  0.        , 1.,  0.
		, -sin(angle), 0.,  cos(angle)
	);
}

mat3 rotate3z(float angle) {
	return mat3(
		   cos(angle),  sin(angle), 0.
		, -sin(angle),  cos(angle), 0.
		,  0.        ,  0.        , 1.
	);
}




vec4 map_or(vec4 l, vec4 r) {
	return l.w < r.w ? l : r;
}






const float map_uv_scale = pow(scale_mul, float(map_iterc));
const float map_inv_iterc = 1./float(map_iterc);
vec4 nd_map(vec3 p, bool sanitize) {
	vec3 uv = p;// / map_uv_scale;
	float s = scale0 * map_uv_scale;
	mat3 rmat = mat3(1., 0., 0.
	                ,0., 1., 0.
	                ,0., 0., 1.);
	for (int i = 0; i < map_iterc; ++i) {
		vec3 csgn = sign(uv);
		uv *= csgn;
		rmat[0] *= csgn;
		rmat[1] *= csgn;
		rmat[2] *= csgn;
		
		uv -= s;
		
		mat3 crmat =
			rotate3x(1.5+float(i)) *
			rotate3y(2.1+.0*map_inv_iterc*time) *
			rotate3z(4.7+sin(.4*float(i)*map_inv_iterc*time));
		uv   = crmat * uv;
		rmat = crmat * rmat;
		s *= scale_mul;
	}
	//uv *= map_uv_scale;
	
	if (sanitize) {
		uv = mat3(
			 rmat[0][0], rmat[1][0], rmat[2][0]
			,rmat[0][1], rmat[1][1], rmat[2][1]
			,rmat[0][2], rmat[1][2], rmat[2][2]
		) * uv;
	}
	
	#ifdef PLANE
		return map_or(
			 vec4(normalize(uv), length(uv)-thickness*s)
			,vec4(sanitize ? vec3(0., 0., 1.) : vec3(.5, .5, .5)
			,p.z)
		);
	#else
		return vec4(normalize(uv), length(uv)-thickness*s);
	#endif
	//return vec4(normalize(uv), length(uv)-((1.-.5*length(p))*s));
}

void main() {
	vec3 camp = rotate3z(-4.*(mouse.x-.5)) * rotate3y(-1.5*(mouse.y-1.)) *
		vec3(0., 0., camera_distance);
	//vec3 camp = .5*vec3(-3., -4.,  7.);

	vec3 camd = normalize( -camp/*vec3( 3.,  4., -7.)*/ );
	vec3 camu_ = normalize(
		vec3(0., 0.0001, 1.) );

	vec3 camr = normalize( cross(camd, camu_) );
	vec3 camu = normalize( cross(camr, camd) );


	float ltime = .3;//time;
	float mtime = 1.;

	vec3 lightd = normalize( vec3(4.*vec2(cos(ltime), sin(ltime)), -3.) );




	float mx = min(resolution.x, resolution.y);
	vec2 uv = vec2(0., .05) + (gl_FragCoord.xy - .5*resolution.xy) / mx;

	vec3 rp = camp;
	vec3 rd = normalize( camd + uv.x*camr + uv.y*camu );
	
	float depth = 0.;
	vec4 res;
	for (int i = 0; i < rm_main_iterc; ++i) {
		res = nd_map(rp, true);
		depth += res.w;
		rp = camp + depth * rd;
	}
	
	vec4 res_insane = nd_map(rp, false);
	
	#ifdef SHADOW
		float shadow_mdist = 1./0.;
		float depth_sh = rm_shadow_eps;
		rp.z += .01*max(0., length(rp)-5.);
		vec3 rp0 = rp - depth_sh * lightd;//2. *lightd * res.w;
		     rp = rp0;
		     rd = -lightd;
		for (int i = 0; i < rm_shadow_iterc; ++i) {
			vec4 sres = nd_map(rp, false);
			sres.w += shadow_narrowing_comp*depth_sh;
			shadow_mdist = min(shadow_mdist, sres.w/depth_sh);
			depth_sh += sres.w * rm_shadow_distmul;
			rp = rp0 + depth_sh * rd;
		}
		shadow_mdist -= shadow_narrowing_comp;
		float shadow_mul = clamp(shadow_sharpness*shadow_mdist+shadow_narrowing_disp, 0., 1.);
	#else
		const float shadow_mul = 1.;
	#endif
	
	gl_FragColor = vec4(
		vec3(1. //depth
			  * clamp( .5*(20.-depth), 0., 1.)
			  * float(res.w < .01) 
			  * abs(res_insane.xyz)
			  
		     * (3.
			    * (.0 + max(0., dot(res.xyz, -lightd))) 
			    * (.0 + shadow_mul)
				 + .02
			  )
		)
	, 1.);
}