#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = 3.1415926535897932384626;
vec3 eyepos = vec3(0.0, 0.0, -5.0);
vec2 yawpitch = vec2(0, 0);

struct cylinder_t
{
    vec3 p;
	float height;
	float radius;
    mat3 r;
};

mat3 rot_x(float ang)
{
    float sang = sin(ang);
    float cang = cos(ang);
    return mat3
    (
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, cang,-sang),
        vec3(0.0, sang, cang)
    );
}

mat3 rot_y(float ang)
{
    float sang = sin(ang);
    float cang = cos(ang);
    return mat3
    (
        vec3( cang, 0.0, sang),
        vec3(  0.0, 1.0, 0.0),
        vec3(-sang, 0.0, cang)
    );
}

mat3 rot_z(float ang)
{
    float sang = sin(ang);
    float cang = cos(ang);
    return mat3
    (
        vec3( cang, sang, 0.0),
        vec3(-sang, cang, 0.0),
        vec3(0.0, 0.0, 1.0)
    );
}

mat3 rot_axis(vec3 v, float ang)
{
    float sang = sin(ang);
    float cang = cos(ang);
    return mat3
    (
        vec3
        (
            (1.0 - cang) * v.x * v.x + cang,
            (1.0 - cang) * v.x * v.y - sang * v.z,
            (1.0 - cang) * v.x * v.z + sang * v.y
        ),
        vec3
        (
            (1.0 - cang) * v.y * v.x + sang * v.z,
            (1.0 - cang) * v.y * v.y + cang,
            (1.0 - cang) * v.y * v.z - sang * v.x
        ),
        vec3
        (
            (1.0 - cang) * v.z * v.x - sang * v.y,
            (1.0 - cang) * v.z * v.y + sang * v.x,
            (1.0 - cang) * v.z * v.z + cang
        )
    );
}
    
mat3 rot_yaw_pitch_roll(vec3 ypr)
{
    return rot_z(ypr.z) * rot_x(ypr.y) * rot_y(ypr.x);
}

bool cylinder_raycast(cylinder_t cylinder, vec3 orig, vec3 dir, out vec3 castpoint, out vec3 normal, out vec2 uv, out float intersect_dist, inout bool isfrominside)
{
	// mat3 minv = inverse(cylinder.r);
	vec3 local_orig = cylinder.r * (orig - cylinder.p);
	vec3 local_dir = cylinder.r * dir;
	float r = cylinder.radius;
	float rsq = r * r;
	float hh = cylinder.height / 2.;
	
	bool isinside = false;
	
	float ray_proj = dot(-local_orig.xz, normalize(local_dir.xz));
	float orig_to_axis_dist_sq = dot(local_orig.xz, local_orig.xz);
	float axis_to_ray_sq = max(0., orig_to_axis_dist_sq - ray_proj * ray_proj);
	if(axis_to_ray_sq > rsq) return false;
	float foo = sqrt(rsq - axis_to_ray_sq);
    float dist1 = ray_proj - foo;
    float dist2 = ray_proj + foo;
	if(orig_to_axis_dist_sq < rsq && abs(local_orig.y) <= hh) isinside = true;
	if(isinside && !isfrominside) return false;
	if(isfrominside) intersect_dist = dist2 / length(local_dir.xz);
	else intersect_dist = dist1 / length(local_dir.xz);
	
	vec3 local_cast = local_orig + local_dir * intersect_dist;
	vec3 local_normal = vec3(local_cast.xz, 0.).xzy / r * (isfrominside ? -1.:1.);
	
	if(abs(local_cast.y) > hh)
	{
		float plane1 = (local_orig.y - hh) / (-local_dir.y);
		float plane2 = (local_orig.y + hh) / (-local_dir.y);
        if(isfrominside) intersect_dist = max(plane1, plane2);
        else intersect_dist = min(plane1, plane2);
		local_normal = vec3(0, -sign(local_dir.y), 0);
		local_cast = local_orig + local_dir * intersect_dist;
		if(length(local_cast.xz) > r) return false;
		uv = (local_cast.xz + vec2(r)) / (r * 2.);
	}
	else
	{
		uv.x = (atan(local_normal.z, local_normal.x) / PI) * .5 + .5;
        uv.y = (local_cast.y + hh) / cylinder.height;
	}
	
	castpoint = orig + dir * intersect_dist;
	normal = local_normal * cylinder.r;
	isfrominside = isinside;

    return true;
}

void main()
{
	vec2 xy = (gl_FragCoord.xy - resolution.xy * .5) / resolution.y;
   
    vec2 mouse_rotation = ((mouse.xy / resolution.y) * 2. -1.) * PI;
    if(length(mouse.xy) > 0.00001) mouse_rotation = vec2(mouse);
    
	vec2 yawpitch = vec2(mouse_rotation.x, -mouse_rotation.y);
    mat3 viewmat = rot_yaw_pitch_roll(vec3(yawpitch, 0));
    
    mat3 rot_m = rot_yaw_pitch_roll(vec3(time * .8, time * .3, time * .0));
    
    vec3 ray = normalize(vec3(xy, 1)) * viewmat;
    vec3 eyepos = vec3(0., 0., -5.) * viewmat;
    
    vec4 color = vec4(.2, .5, 1., 1.);
    
    vec3 castpnt, castnormal;
    vec2 castuv;
    float castdist;
    bool isfrominside = false;

    cylinder_t cyl = cylinder_t(vec3(0, 0, 0), 5., 1., rot_m);
    
    isfrominside = false;
    // if(xy.x > 0.)isfrominside = true;
    if(cylinder_raycast(cyl, eyepos, ray, castpnt, castnormal, castuv, castdist, isfrominside))
	{
        // color = vec4(castdist - 4.5 + sin(iTime));
        color += .25*vec4(dot(castnormal, vec3(1,2.,.5+0.1*sign(cos(castuv.x*360.))+0.1*sign(cos(castuv.y*360.)) ))) / (1. + castdist*castdist*castdist*0.01);
       // color = texture(iChannel0, castuv);
        // color = texture(iChannel0, castnormal);
         //color = vec4(castuv, 0., 1.);
	}
    
	gl_FragColor = color;
}