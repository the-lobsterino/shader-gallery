#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D backbuffer;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//////////////////////////////////////////////////
// CONSTANTS
//////////////////////////////////////////////////

#define FLT_MAX 3.402823466e+38
#define EPSILON 0.001
#define INVALID (FLT_MAX)
#define SAMPLE_THRESHOLD 16

const float pi = 3.14159265;

//////////////////////////////////////////////////
// STRUCTURES
//////////////////////////////////////////////////

struct ray
{
	vec3 pos, dir;
};

struct intersection
{
  vec3 pos, normal;
  float t;
  int material_id;
};

struct material
{
  vec3 diffuse, specular;
  float shininess;
};

struct camera
{
  vec3 pos, view, up, right;
};

struct plane
{
	vec3 pos, normal;
  float radius_sqr;
  int material_id;
};

struct sphere
{
  vec3 pos;
  float radius;
  float radius_sqr;
  int material_id;
};

//////////////////////////////////////////////////
// GLOBALS
//////////////////////////////////////////////////

//supersampling positions
vec3 pos00 = vec3( 0.25, 0.25, 0 );
vec3 pos10 = vec3( 0.75, 0.25, 0 );
vec3 pos01 = vec3( 0.25, 0.75, 0 );
vec3 pos11 = vec3( 0.75, 0.75, 0 );

vec3 inv_screensize;
float aspect;

vec3 sky_color = pow( vec3( 1.678, 0.874, 1.0 ), vec3(2.2) );

#define NUM_MATERIALS 3
material materials[NUM_MATERIALS];

#define NUM_LIGHTS 1
sphere lights[NUM_LIGHTS];
vec3 light_colors[NUM_LIGHTS];

#define NUM_PLANES 6
plane planes[NUM_PLANES];

#define NUM_SPHERES 1
sphere spheres[NUM_SPHERES];

//////////////////////////////////////////////////
// FUNCTIONS
//////////////////////////////////////////////////

float seed = 0.0;
float rand()
{
	return fract( sin( seed++ ) * 43758.5453123 ) * 2.0 - 1.0;
}

intersection intersect_plane( ray r, plane p )
{
  intersection i;

  float denom = dot( r.dir, p.normal );

  if( abs( denom ) - EPSILON > 0.0 )
  {
    float t = dot( p.pos - r.pos, p.normal );
    float tmp = t * denom;

    if( tmp > 0.0 )
    {
      i.t = t / denom;
      i.pos = r.pos + r.dir * i.t;

      vec3 diff = i.pos - p.pos;

      if( dot( diff, diff ) > p.radius_sqr )
      {
      	i.t = INVALID;
      }
      else
      {
        i.normal = denom < 0.0 ? p.normal : -p.normal;
      }
    }
    else
    {
      i.t = INVALID;
    }
  }
  else
  {
  	i.t = INVALID;
  }

  return i;
}

intersection intersect_sphere( ray r, sphere s )
{
  intersection i;

  vec3 x = r.pos - s.pos;

  float aa = dot( r.dir, r.dir );
  float bb = dot( r.dir, x ) * 2.0;
  float cc = dot( x, x ) - s.radius_sqr;

  float sqr = bb * bb - 4.0 * aa * cc;

  if( sqr > 0.0 && abs( aa ) - EPSILON > 0.0 )
  {
    float root = sqrt( sqr );
    float inv_2a = 1.0 / ( 2.0 * aa );

    float t = ( -bb - root ) * inv_2a;
    i.normal = vec3( 1 );

    if( t < 0.0 )
    {
      t = ( -bb + root ) * inv_2a;

      if( t < 0.0 )
      {
        i.t = INVALID;
        return i;
      }

      i.normal = -i.normal;
    }

    i.pos = r.pos + r.dir * t;
    i.normal *= i.pos - s.pos;
    i.t = t;
  }
  else
  {
    i.t = INVALID;
  }

  return i;
}

vec3 rotate_2d( vec3 p, float angle )
{
  p.x = p.x * cos( angle ) - p.y * sin( angle );
  p.y = p.y * cos( angle ) + p.x * sin( angle );
  return p;
}

void calculate_ssaa_pos()
{
  float angle = atan( 0.5 );
  float stretch = sqrt( 5.0 ) * 0.5;

  pos00 = rotate_2d( pos00, angle );
  pos01 = rotate_2d( pos01, angle );
  pos10 = rotate_2d( pos10, angle );
  pos11 = rotate_2d( pos11, angle );

  pos00 = ( pos00 - vec3( 0.5, 0.5, 0 ) ) * stretch + vec3( 0.5, 0.5, 0 );
  pos01 = ( pos01 - vec3( 0.5, 0.5, 0 ) ) * stretch + vec3( 0.5, 0.5, 0 );
  pos10 = ( pos10 - vec3( 0.5, 0.5, 0 ) ) * stretch + vec3( 0.5, 0.5, 0 );
  pos11 = ( pos11 - vec3( 0.5, 0.5, 0 ) ) * stretch + vec3( 0.5, 0.5, 0 );
}

camera lookat( vec3 eye, vec3 lookat, vec3 up )
{
  camera c;
  c.view = normalize( lookat - eye );
  c.up = normalize( up );
  c.pos = eye;
  c.right = normalize( cross( c.view, c.up ) );
  c.up = normalize( cross( c.right, c.view ) );
  return c;
}

intersection get_closest_intersection( ray r )
{
  intersection i;
  intersection tmp;
  i.t = INVALID;

  for( int c = 0; c < NUM_PLANES; ++c )
  {
    tmp = intersect_plane( r, planes[c] );
    if( tmp.t < i.t )
    {
      i = tmp;
      i.material_id = planes[c].material_id;
    }
  }

  for( int c = 0; c < NUM_SPHERES; ++c )
  {
    tmp = intersect_sphere( r, spheres[c] );
    if( tmp.t < i.t )
    {
      i = tmp;
      i.material_id = spheres[c].material_id;
    }
  }

  i.normal = normalize( i.normal );

  return i;
}

material get_material( int x )
{
  if( x == 0 ) return materials[0];
  if( x == 1 ) return materials[1];
  if( x == 2 ) return materials[2];

  //missing material
  material m;
  m.diffuse = vec3( 1, 0, 1 );
  m.specular = vec3( 1, 0, 1 );
  m.shininess = 10.0;
  return m;
}

float trace_shadow( vec3 pos, vec3 dir, float dist )
{
  ray shadow_ray;
  shadow_ray.pos = pos;
  shadow_ray.dir = dir;
  shadow_ray.pos += shadow_ray.dir * EPSILON;

  intersection i = get_closest_intersection( shadow_ray );
  return float(i.t > dist);
}

vec3 trace( ray r )
{
	vec3 color = vec3( 0 );
	vec3 diffuse_surf_color = vec3( 1 );
	vec3 specular_surf_color = vec3( 1 );

  for( int s = 0; s < SAMPLE_THRESHOLD; ++s )
  {
    intersection i = get_closest_intersection( r );

    if( i.t >= INVALID )
    {
        if( s == 0 )
            return sky_color;
        else
        	break;
    }

    material m = get_material( i.material_id );

    vec3 n = i.normal;

    vec3 diffuse_color = vec3( 0 );
		vec3 specular_color = vec3( 0 );

    for( int c = 0; c < NUM_LIGHTS; ++c )
    {
      vec3 l = lights[c].pos - i.pos;
      float dist_sqr = dot( l, l );
      float dist = sqrt( dist_sqr );
      l /= dist;

      float n_dot_l = dot( n, l );

      if( n_dot_l > 0.0 )
      {
        vec3 rnd = normalize( vec3( rand(), rand(), rand() ) );
        float shadow_factor = trace_shadow( i.pos, l + rnd * 0.05, dist );

        vec3 v = -r.dir;
        vec3 h = normalize( v + l );

        vec3 diffuse = light_colors[c] * vec3( 1 );
        vec3 specular = light_colors[c] * vec3( pow( max( dot( n, h ), 0.0 ), m.shininess ) );

        float attenuation = 1.0 / ( 1.0 + 2.0 * dist / lights[c].radius + dist_sqr / (lights[c].radius_sqr) );

				diffuse_color += n_dot_l * diffuse * attenuation * shadow_factor;
				specular_color += n_dot_l * specular * attenuation * shadow_factor;
    	}
    }

		diffuse_surf_color *= m.diffuse;
		specular_surf_color *= m.specular;
    color += diffuse_color * diffuse_surf_color + specular_color * specular_surf_color;

    if( rand() < m.shininess / 255.0 )
    { //diffuse ray
      r.pos = i.pos;
      r.dir = normalize( vec3( rand(), rand(), rand() ) );
      r.dir *= sign( dot( n, r.dir ) );
      r.pos += r.dir * EPSILON;
    }
    else
    { //specular ray
      r.pos = i.pos;
      r.dir = normalize( reflect( r.dir, n ) + vec3( rand(), rand(), rand() ) / m.shininess );
      r.pos += r.dir * EPSILON;
    }
  }

  return color / float(SAMPLE_THRESHOLD);
}

vec3 calculate_pixel( camera c, vec3 pos )
{
  //2x2 near plane, 90 degrees vertical fov
	vec3 plane_pos = pos * inv_screensize * 2.0 - vec3( 1, 1, 0 );
  plane_pos.y *= aspect; //well, y will not be 2 tall

  ray r;
  r.pos = c.pos + c.view + c.right * plane_pos.x + c.up * plane_pos.y;
  r.dir = normalize(r.pos - c.pos);

  vec3 color = trace( r );

  float exposure = 1.0;
  vec3 lumval = vec3( 0.21, 0.72, 0.07 );
  float lum = dot( lumval, color );

  float final_lum = exposure * lum / ( 1.0 + exposure * lum );

  vec3 tonemapped_color = clamp(color * (final_lum / lum), 0.0, 1.0 );
  return tonemapped_color;
}

void main(void)
{
    //set up globals
    inv_screensize = 1.0 / vec3( resolution.xy, 1 );
    aspect = resolution.y / resolution.x;
    seed += aspect * gl_FragCoord.x + gl_FragCoord.y * inv_screensize.y + time;
    calculate_ssaa_pos();

		vec2 uv = gl_FragCoord.xy * inv_screensize.xy;
		vec4 last_frame = texture2D( backbuffer, uv );
		float num_frames = min( last_frame.w * 255.0, 254.0 );

    //set up the camera
    camera c = lookat( vec3( 0, 0, 4.5 ), vec3( 0, -2, 0 ), vec3( 0, 1, 0 ) );

    //set up materials
    materials[0].diffuse = vec3( 1 );
    materials[0].specular = vec3( 1 );
    materials[0].shininess = 1.0;

    materials[1].diffuse = vec3( 1, 0.3, 0.1 );
    materials[1].specular = vec3( 1 );
    materials[1].shininess = 10.0;

    materials[2].diffuse = vec3( 0.3, 1.0, 0.1 );
    materials[2].specular = vec3( 1 );
    materials[2].shininess = 10.0;

		for( int c = 0; c < NUM_MATERIALS; ++c )
		{
			materials[c].diffuse = pow( materials[c].diffuse, vec3( 2.2 ) );
			materials[c].specular = pow( materials[c].specular, vec3( 2.2 ) );
		}

    //set up planes
    planes[0].pos = vec3( 0, -5, 0 );
    planes[0].normal = vec3( 0, 1, 0 );
    planes[0].radius_sqr = 10.0;
    planes[0].material_id = 0;

    planes[1].pos = vec3( -5, 0, 0 );
    planes[1].normal = vec3( 1, 0, 0 );
    planes[1].radius_sqr = 10.0;
    planes[1].material_id = 1;

    planes[2].pos = vec3( 5, 0, 0 );
    planes[2].normal = vec3( -1, 0, 0 );
    planes[2].radius_sqr = 10.0;
    planes[2].material_id = 2;

    planes[3].pos = vec3( 0, 0, -5 );
    planes[3].normal = vec3( 0, 0, 1 );
    planes[3].radius_sqr = 10.0;
    planes[3].material_id = 0;

    planes[4].pos = vec3( 0, 0, 5 );
    planes[4].normal = vec3( 0, 0, -1 );
    planes[4].radius_sqr = 10.0;
    planes[4].material_id = 0;

    planes[5].pos = vec3( 0, 5, 0 );
    planes[5].normal = vec3( 0, -1, 0 );
    planes[5].radius_sqr = 10.0;
    planes[5].material_id = 0;

    for( int c = 0; c < NUM_PLANES; ++c )
    {
      planes[c].radius_sqr *= planes[c].radius_sqr;
    }

    //set up spheres
    spheres[0].pos = vec3( 0, -2, 0 );
    spheres[0].radius = 1.0;
    spheres[0].material_id = 0;

    for( int c = 0; c < NUM_SPHERES; ++c )
    {
      spheres[c].radius_sqr = spheres[c].radius * spheres[c].radius;
    }

    //set up lights
    lights[0].pos = vec3( 1, 0, 4 );
    lights[0].radius = 10.0;
    light_colors[0] = vec3( 10 );

    for( int c = 0; c < NUM_LIGHTS; ++c )
    {
      lights[c].radius_sqr = lights[c].radius * lights[c].radius;
    }

    vec3 color = ( calculate_pixel( c, vec3( gl_FragCoord.xy, 0 ) + pos00 ) +
        		       calculate_pixel( c, vec3( gl_FragCoord.xy, 0 ) + pos01 ) +
        		       calculate_pixel( c, vec3( gl_FragCoord.xy, 0 ) + pos10 ) +
        		       calculate_pixel( c, vec3( gl_FragCoord.xy, 0 ) + pos11 ) ) * 0.25;

	vec3 last_frame_linear = pow( last_frame.xyz, vec3(2.2) );
	vec3 accum_color = (color + last_frame_linear / num_frames) / (num_frames + 1.0);
	vec3 accum_color_gamma = pow( clamp( accum_color, 0.0, 1.0 ), vec3( 1.0 / 2.2 ) );
	gl_FragColor = vec4( accum_color_gamma, (num_frames+1.0) / 255.0 );
}
