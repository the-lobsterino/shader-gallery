#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
struct ray_t
{
	vec3 origin;
	vec3 direction;
};
	
struct sphere_t
{
	vec3 origin;
	float radius;
};
	
struct plane_t
{
	vec3  normal;
	float offset;
	vec3 orientation;
};
	
struct light_t
{
	vec3  direction;
	float contribution;
};

struct surface_t
{
	int  identifier;
	vec3 position;
	vec3 normal;
};
	
const int NONE   = 0;
const int PLANE  = 1;
const int SPHERE = 2;
	
const float PI = 3.14;
const float max_distance = 1e5;
	
float intersect_sphere( const in sphere_t sphere, const in ray_t ray, out surface_t surface )
{
	mat4 world_to_object = mat4(
		1.0, 0.0, 0.0, -sphere.origin.x,
		0.0, 1.0, 0.0, -sphere.origin.y,
		0.0, 0.0, 1.0, -sphere.origin.z,
		0.0, 0.0, 0.0, 0.0
	);
	
	vec3 position = vec3( vec4( ray.origin, 1.0 ) * world_to_object );
	
	const float a = 1.0;
	float b = 2.0 * dot( position, ray.direction );
	float c = dot( position, position ) - pow( sphere.radius, 2.0 );
	float h = pow( b, 2.0 ) - 4.0 * a * c;
	
	if( h < 0.0 ) return max_distance; //no intersection
	
	float square_root = sqrt( h );
	float t1 = (-b + square_root) / ( 2.0 * a );
	float t2 = (-b - square_root) / ( 2.0 * a );
	
	if( t1 < t2 )
	{
		surface.position = ray.origin + ray.direction * t1;
	}
	else
	{
		surface.position = ray.origin + ray.direction * t2;
	}
	
	surface.normal = normalize( ( surface.position - sphere.origin ) / sphere.radius );
	
	surface.identifier = SPHERE;
	return min( t1, t2 );
}

float intersect_plane( const in plane_t plane, const in ray_t ray, out surface_t surface )
{
	vec3 c = cos( plane.orientation ), s = sin( plane.orientation );
	
	mat3 rotation_x = mat3(
		1.0, 0.0, 0.0,
		0.0, c.x,-s.z,
		0.0, s.x, c.x
	);
	
	mat3 rotation_y = mat3(
		c.y, 0.0,  s.y,
		0.0, 1.0,  0.0,
	   -s.y, 0.0,  c.y
	);
	
	mat3 rotation_z = mat3(
		c.z,-s.z,  0.0,
		s.z, c.z,  0.0,
	    0.0, 0.0,  1.0
	);
	
	vec3 plane_normal = normalize( plane.normal ) * rotation_x * rotation_y * rotation_z;
	
	vec3 /* normal_by_origin */ no = plane_normal * ray.origin;
	vec3 /* normal_by_direction */ nd = plane_normal * ray.direction;
	float distance_from_origin = ( - no.x - no.y - no.z - plane.offset ) / ( nd.x + nd.y + nd.z );
	
	surface.position = ray.origin + ray.direction * distance_from_origin;
	surface.normal   = plane_normal;
	
	surface.identifier = PLANE;
	return distance_from_origin < 0.0 ? max_distance : distance_from_origin;
}

float intersect( const in ray_t ray, out surface_t surface, const in int avoid )
{
	const sphere_t sphere1 = sphere_t( vec3( 0.0, 0.0, 0.0 ), 1.2 );
	const plane_t  plane   = plane_t( vec3( 0.0, 1.0, 0.0 ), 0.6, vec3( PI / 12.0, 0.0, 0.0 ) );
	
	surface_t surface_sphere, surface_plane;
	float distance_from_sphere = intersect_sphere( sphere1, ray, surface_sphere );
	float distance_from_plane  = intersect_plane( plane, ray, surface_plane );
	
	if( ( distance_from_sphere < distance_from_plane ) && ( avoid != SPHERE ) )
	{
		surface = surface_sphere;
	}
	else if( ( distance_from_plane < max_distance ) && ( avoid != PLANE ) )
	{
		surface = surface_plane;
	}
	else
	{
		surface.identifier = NONE;
		surface.position   = vec3( 0.0 );
		surface.normal     = vec3( 0.0 );
	}
	
	return min( distance_from_sphere, distance_from_plane );
}

void light0_information( const in surface_t surface, out light_t light )
{
	      vec3  directional_direction    = vec3( 1.0, 1.0,-0.3 );
	const float directional_contribution = 1.0;
	
	light.direction    = normalize( directional_direction );
	light.contribution = directional_contribution;
}

void light1_information( const in surface_t surface, out light_t light )
{
	const vec3  point_position              = vec3( 0.0, 0.5, 20.0 );
	const float point_contribution_modifier = 0.6;
	
	light.direction    = normalize( point_position - surface.position );
	light.contribution = length( light.direction ) * point_contribution_modifier;
}

float illumination( const in ray_t ray, const in surface_t surface, const in light_t light )
{
	float diffuse = max( 0.0, dot( surface.normal, light.direction ) );
	
	float contribution = diffuse * light.contribution;
	
	return contribution;
}

float shadow( const in surface_t surface, const in light_t light )
{
	ray_t shadow_ray;
	shadow_ray.origin    = surface.position;
	shadow_ray.direction = light.direction;
	
	surface_t hitted_surface;
	float distance_from_object = intersect( shadow_ray, hitted_surface, surface.identifier );
	
	return ( hitted_surface.identifier != NONE ) ? distance_from_object : max_distance;
}

void main(void)
{
	vec2 screen_coordinate          = gl_FragCoord.xy / resolution.xy;
	vec2 screen_coordinate_centered = 2.0 * screen_coordinate - 1.0;
	
	float aspect_ratio = resolution.x / resolution.y;
	vec2  screen_coordinate_lens_corrected = vec2( aspect_ratio, 1.0 ) * screen_coordinate_centered;
	
	ray_t primary_ray;
	primary_ray.origin    = vec3( 0.0, 0.0, mix( 2.0, 3.0, 0.5 + 0.5 * sin( time ) ) );
	primary_ray.direction = normalize( vec3( screen_coordinate_lens_corrected, -1.0 ) );
	
	surface_t surface;
	float distance_from_origin = intersect( primary_ray, surface, NONE );
	
	const vec3 background_color = vec3( 0.3, 0.3, 0.5 );
	if( ( distance_from_origin < max_distance ) && surface.identifier != NONE )
	{
		light_t light;
		float illumination_from_light = float( 0.0 );
		
		light0_information( surface, light );
		float illumination_light0 = illumination( primary_ray, surface, light ); 
		float shadow_cast_light0  = shadow( surface, light ); 
		illumination_from_light += illumination_light0 * clamp( shadow_cast_light0, 0.0, 1.0 );
		
		light1_information( surface, light );
		float illumination_light1 = illumination( primary_ray, surface, light ); 
		float shadow_cast_light1  = shadow( surface, light ); 
		illumination_from_light += illumination_light1 * clamp( shadow_cast_light1, 0.0, 1.0 );
			
		gl_FragColor = vec4( vec3( illumination_from_light ), 1.0 );
	}
	else
	{
		gl_FragColor = vec4( vec3( background_color ), 1.0 );
	}
}