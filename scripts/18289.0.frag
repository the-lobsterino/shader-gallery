#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 voxel[2*2*2];

vec4 cube1 = vec4( 0.0, 0.0, 5.0, 0.5 );
vec4 cube2 = vec4( 0.0, 0.5, 5.5, 0.5 );

vec3 iCube( vec3 ro, vec3 rd, vec4 cube )
{
	vec3 pos = ro - cube.xyz;
	float t = -pos.z/rd.z;
	if( t > 0.0 )
	{
		vec2 uv = (pos + t * rd).xy;
		if( 0.0 < uv.x && uv.x < cube.w
		 && 0.0 < uv.y && uv.y < cube.w
		  )
		return vec3( 1.0, 0.0, 0.0 );
	}
	
	return vec3( 0.0 );
}

vec3 trace( vec3 ro, vec3 rd )
{
	
	return iCube( ro, rd, cube1 ) + iCube( ro, rd, cube2 );
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec3 ro = vec3( 0.0, 1.0, 0.0 );
	vec3 rd = normalize( vec3( -1.0 + 2.0*uv, 1.0 ) );
	vec3 color = trace( ro, rd );

	gl_FragColor = vec4( color, 0.5 );

}