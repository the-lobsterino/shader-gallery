
// lets write a small raytracer from scratch

#ifdef GL_ES
  precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

// intersection ids
#define id_background 0
#define id_plane 1
#define id_sphere 2

// ray -> sphere intersection
float iSphere( in vec3 ro, in vec3 rd, in vec4 sph )
{
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot(oc,oc) - sph.w*sph.w;
	float h = b*b - c;
	if( h < 0.0 ) return -1.0;
	return -b - sqrt(h);
}

// return sphere normal
vec3 nSphere( in vec3 pos, in vec4 sph )
{
	return (pos - sph.xyz) / sph.w;
}

// ray -> plane intersection
float iPlane( in vec3 ro, in vec3 rd )
{
	return -ro.y / rd.y;
}

// return plane normal
vec3 nPlane( in vec3 pos)
{
	return vec3(0.0, 1.0, 0.0);
}

// sphere with radius 1.0
vec4 sph1 = vec4( 0.0, 1.0, 0.0, 1.0);

// get intersection id and intersection distance t 
int intersect( in vec3 ro, in vec3 rd, out float t )
{
	t = 100.0;
	int id = id_background;
	float tsph = iSphere( ro, rd, sph1 );
	float tpla = iPlane( ro , rd);
	if ( tsph > 0.0)
	{
		id = id_sphere;
		t = tsph;
	}
	if (tpla > 0.0 && tpla < t)
	{
		id = id_plane;
		t = tpla;
	}
	return id;
}

void main( void ) 
{
	vec3 light = normalize( vec3(0.17703));
	// uv are pixel coordinates, from 0 to 1
	vec2 uv = (gl_FragCoord.xy / resolution); 
	
	sph1.x = 0.5*cos(time);
	sph1.z = 0.5*sin(time);
	
	// we generate a ray with orgin ro and direction rd
	vec3 ro = vec3( 0.0, 0.5, 3.0 );
	vec3 rd = normalize( vec3( (-1.0+2.0*uv) * vec2(1.78,1.0), -1.0) );
	
	// we intersect the ray with the 3d scene
	float t;
	int id = intersect( ro, rd, t );
	
	// we draw gray, by default
	vec3 col = vec3(0.7);
	if( id == id_sphere)
	{
		vec3 pos = ro + t * rd;
		vec3 nor = nSphere( pos, sph1 );
		float dif = clamp(dot( nor, light ), 0.0, 1.0);
		float ao = 0.5 + 0.5 * nor.y;
		col = vec3( 0.9, 0.8, 0.6 )*dif*ao + vec3(0.1,0.2,0.4)*ao;
	}
	else if (id == id_plane)
	{
		vec3 pos = ro + t*rd;
		vec3 nor = nPlane(pos);
		float dif = clamp( dot(nor, light), 0.0, 1.0);
		float amb = smoothstep(0.0, 2.0*sph1.w, length(pos.xz-sph1.xz));
		col = vec3(amb*0.7);
	}
	col = sqrt(col);
	gl_FragColor = vec4( col, 1.0 );

}