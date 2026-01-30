#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph )
{
	// so, a sphere centered at the origin has equation |xyz| = r
	// meaning, |xyz|^2 = r^2, meaning <xyz, xyz> = r^2
	// now, xyz = ro + t * rd, therefore |ro|^2 + t^2 + 2<ro,rd>t - r^2 = 0
	// which is a quadratic quation. so
	vec3 oc = ro - sph.xyz;
	float b = 2.0 * dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - 4.0*c;
	if ( h < 0.0 ) return -1.0;
	float t = (-b - sqrt(h)) / 2.0;
	return t;
}

vec3 nSphere( in vec3 pos, in vec4 sph )
{
	return ( pos - sph.xyz ) / sph.w;
}

vec3 nPlane( in vec3 pos )
{
	return vec3(0.0, 1.0, 0.0);
}

float iPlane( in vec3 ro, in vec3 rd )
{
	// equation of a plane, y = 0, 0  = ro.y + t * rd.y
	return -ro.y/rd.y;
}

vec4 sph = vec4( 0.0, 1.0, 0.0, 1.0);
float intersect( in vec3 ro, in vec3 rd, out float resT )
{	
	resT = 1000.0;
	float id = -1.0;
	float tsph = iSphere( ro, rd, sph ); // intersected with a sphere
	float tpla = iPlane( ro, rd );
	
	if ( tsph > 0.0 )
	{
		id = 1.0;
		resT = tsph;	
	}
	if ( tpla > 0.0 && tpla < resT )
	{
		id = 2.0;
		resT = tpla;	
	}
	
	return id;
}

void main( void )
{
	vec3 light = normalize(vec3(sin(time), 0.0, cos(time)));
		
	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	
	
	vec3 ro = vec3(  0.0,  1.0,  3.0 );
	vec3 rd = normalize(vec3( (-1.0+2.0*uv) * vec2(resolution.x / resolution.y, 1.0), -1.0));
	
	float t;
	float id = intersect(ro, rd, t);
	
	
	vec3 col = vec3(0.0);
	if ( id > 0.5 && id < 1.5 )
	{
		vec3 pos = ro + t*rd;
		vec3 nor = nSphere( pos, sph );
		float dif = clamp(0.5 + 0.5*dot(light, nor), 0.0, 1.0);
		float amb = 0.0 + 0.5*nor.y;
		
		col = vec3( 0.0, 0.8, 0.4 ) * dif + amb * vec3(0.0, 0.8, 0.4);
		
	}
	else if ( id > 1.5 )
	{
		vec3 pos = ro + t * rd;
		vec3 nor = nPlane( pos );
		float dif = clamp(0.5 + 0.5*dot(light, nor), 0.0, 1.0);
		float amb = smoothstep( 0.0, sph.w * 2.0, length( pos.xz - sph.xz) );
		col = vec3(amb);
	}
	
	col = sqrt(col);
	gl_FragColor = vec4(col, 1.0);
}