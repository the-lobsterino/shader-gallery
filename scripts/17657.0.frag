#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D iChannel0, iChannel1, bb;

varying vec2 surfacePosition;
varying vec2 surfaceSize;



vec3   iResolution = vec3(resolution, 1.0);
float  iGlobalTime = time;
vec4   iMouse = vec4(mouse, 0.0, 1.0);

float mapWall( vec2 uv )
{
	float sp = texture2D( iChannel0, vec2( iGlobalTime + uv.y * 0.1, 0.0 ) ).x
		- max( 0.0, ( sin( iGlobalTime * 3.0 + uv.y / 3.14 ) + 1.0 ) * 0.4 );
	sp *= max( 4.0 - abs( uv.x ), 0.0 ) * .5;
	
	float zshift = -iGlobalTime * 4.0;
	return min( 
		( 1.0 - abs( mod( uv.x, 2.0 ) - 1.0 ) ), ( 1.0 - abs( mod( uv.y + zshift, 2.0 ) - 1.0 ) ) ) *
		( 1.0 + sp * 2.0 );
}

vec3 calcLighting( vec3 pos, vec3 norm, vec3 light, vec3 amb )
{
	vec3 dirL = normalize( light - pos );
	float dotL = abs( dot( dirL, norm ) );
	vec3 R = reflect( dirL, norm );
	float spec = pow( abs( dot( R, normalize( -pos ) ) ), 10.0 );
	return vec3( dotL * 0.2 ) + vec3( spec * .3 ) + amb + abs( pos * 0.05 );
}

vec3 getPlaneVPos( vec3 pt, float pos )
{
	return pt + vec3( sign( pos ) * mapWall( pt.yz ), 0.0, 0.0 );
}
vec3 getPlaneHPos( vec3 pt, float pos )
{
	return pt + vec3( 0.0, sign( pos ) * mapWall( pt.xz ), 0.0 );
}

vec3 planeVColor( float t, vec3 ro, vec3 rd, float pos, vec3 light, vec3 amb )
{
	vec3 pt = ro + t * rd;
	
	vec3 norm = normalize( cross( 
		getPlaneVPos( pt + vec3( 0.0, 0.0, 0.1 ), pos ) - getPlaneVPos( pt, pos ), 
		getPlaneVPos( pt + vec3( 0.0, sign(pos) * 0.1, 0.0 ), pos ) - getPlaneVPos( pt, pos ) ) );
	
	return calcLighting( pt, norm, light, amb );
}

vec3 planeHColor( float t, vec3 ro, vec3 rd, float pos, vec3 light, vec3 amb )
{
	vec3 pt = ro + t * rd;
	
	vec3 norm = normalize( cross( 
		getPlaneHPos( pt + vec3( 0.0, 0.0, 0.1 ), pos ) - getPlaneHPos( pt, pos ), 
		getPlaneHPos( pt + vec3( sign(pos) * 0.1, 0.0, 0.0 ), pos ) - getPlaneHPos( pt, pos ) ) );
	
	return calcLighting( pt, norm, light, amb );
}

float planeV( vec3 ro, vec3 rd, float pos ) // vertical
{
	float t = 0.0;
	float h = 0.0;
	for( int i = 0; i < 50; i++ )
	{
		vec3 pt = ro + t * rd;
		h = abs( pos - getPlaneVPos( pt, pos ).x );
		if ( h <  0.1 )
		{
			break;
		}
		t += h * 0.32;
	}
	return t;
}
float planeH( vec3 ro, vec3 rd, float pos ) // horizontal
{
	float t = 0.0;
	float h = 0.0;
	for( int i = 0; i < 50; i++ )
	{
		vec3 pt = ro + t * rd;
		h = abs( pos - getPlaneHPos( pt, pos ).y );
		if ( h <  0.1 )
		{
			break;
		}
		t += h * 0.32;
	}
	return t;
}

vec3 colorize( vec2 uv )
{
	vec3 ro = vec3( 0.0, 0.0, 0.0 );
	vec3 rd = normalize( vec3( uv.x - 0.5, uv.y - 0.5, 1.0 ) );
	rd.x *= 1.5;
	
	vec3 c1, c2, c3, c4;
	
	vec3 light = vec3( 0.0, 0.0, 10.0 );
	vec3 amb = vec3( 0.2 );
	
	float t1 = planeV( ro, rd, -6.0 );
	float t2 = planeV( ro, rd,  6.0 );
	float t3 = planeH( ro, rd, -6.0 );
	float t4 = planeH( ro, rd,  6.0 );
	
	float t = 0.0;
	vec3 c = vec3( 0.0, 0.0, 0.0 );

	if ( t1 < t2 && t1 < t3 && t1 < t4 )
	{
		t = t1;
		c = planeVColor( t, ro, rd, -6.0, light, amb );
	}
	else if ( t2 < t3 && t2 < t4 )
	{
		t = t2;
		c = planeVColor( t, ro, rd,  6.0, light, amb );
	}
	else if ( t3 < t4 )
	{
		t = t3;
		c = planeHColor( t, ro, rd, -6.0, light, amb );
	}
	else
	{
		t = t4;
		c = planeHColor( t, ro, rd,  6.0, light, amb );
	}

	float mult = clamp( 4.0 - t * 0.05 , 0.0, 4.0 ) * 0.25;
	return c * mult + vec3( 1.0 - mult );
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;

	vec3 color = colorize( uv );	
	
	gl_FragColor = vec4(color,1.0);
}