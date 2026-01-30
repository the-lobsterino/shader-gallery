#extension GL_OES_standard_derivatives : enable

#define RENDER_DISTANCE 100.0
#define ENABLE_DISTANCE_FOG 1

#define DISTANCE_BETWEEN_SPHERES 3.0
#define SPHERE_RADIUS 0.25

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415926535897932384626433832795;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float map( vec3 p )
{
	p = abs(p);
	p = mod(p,DISTANCE_BETWEEN_SPHERES)-DISTANCE_BETWEEN_SPHERES/2.0;
	float distance = length(p)-SPHERE_RADIUS*2.0-normalize(rand(p.xy))*0.1;
	return distance;
}



float raymarch( in vec3 ro, in vec3 rd )
{
	float d = 0.0;
	float t = 0.0;
	for( int i=0; i<10000000; i++ )
	{
		d = map( ro + rd*t );
		t += d;
		if( d<0.0001 || t>RENDER_DISTANCE ) break;
	}
	return t;
}

vec3 calcNormal( in vec3 p )
{
	vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
	return normalize( e.xyy*map(p+e.xyy) + e.yyx*map(p+e.yyx) + e.yxy*map(p+e.yxy) + e.xxx*map(p+e.xxx) );
}

void main()
{
	vec2 uv = gl_FragCoord.xy/resolution.xy*2.0-1.0;
	uv.x *= resolution.x/resolution.y;

	vec3 movement = vec3(mouse.x, mouse.y, time*0.2) * 10.0;

	vec3 rd = normalize( vec3(uv.xy,2.0) );

	float t = raymarch( movement, rd );

	vec3 col = vec3(0.0);
	{
		vec3 pos = movement + rd*t;
		vec3 nor = calcNormal( pos );
		col = 0.5 + 0.5*nor;
	}

	#if ( ENABLE_DISTANCE_FOG == 1 )
		float fogStrength = 0.002;
		vec3 fogColor = vec3(0.2, 0.0, 0.2);
       	        col = mix(col, fogColor, 1.0 - (1.0) / (1.0 + t*t*fogStrength));
	#endif

	gl_FragColor = vec4( col, 1.0 );
}