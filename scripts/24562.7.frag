#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define NB_ITER 128.0
#define FAR 	100.0

float mapFloor ( vec3 pos )
{
	return pos.y;
}

float mapSphere( vec3 pos, float size )
{
	return length(  pos ) - size;
}


float Mylength( vec3 pos )
{
	return max(abs(pos.x), max( abs(pos.y), abs( pos.z)) );
}

float Mylength2( vec3 pos )
{
	return abs(pos.x) + abs(pos.y) + abs( pos.z);
}

float mapCube( vec3 pos, float size)
{
	return Mylength(  pos ) - size;
}


float combine(float val1, float val2 )
{
	return min( val1, val2);
}

float mapLotsOfSpheres( vec3 pos, float radius, float rate)
{
	return length( mod( pos+rate*.5, rate) -rate*.5) - radius;
}



float map( vec3 pos)
{
	float val1= mapFloor( pos );
	float val2 = mapSphere(pos + vec3( 10.*sin(time), -5, -50. + 10.*cos(time) ), 5. );
	float val3 = mapSphere(pos + vec3( 10.*sin(time + 3.1), -5., -50. + 10.*cos(time+3.1) ), 5. );
	float val4 = mapCube(pos + vec3( 0., -5., -50.), 5.);
	float val5 = combine ( val2, val3 );
	float val6 = combine ( val4, val5 );
	//float val7 = combine ( val6, mapLotsOfSpheres(pos + 2.*sn(time), 3., 20.) );
	return combine( val1, val6);
}

float softShadow( in vec3 ro, in vec3 rd ) {
	
	float res = 1.0;
	float t = 0.1;
	
	for( int i = 0; i < 20; i++ ) {
		
		if ( t >= 10.0 ) break;
		
		float h = map(ro + t * rd);
		if (h < 0.001) return 0.0;
		
		res = min( res, h / t );
		
		t += h;
		
	}
	
	return res;
	
}
vec3 calcNormal( in vec3 p ) {
	
	vec3 e = vec3( 0.001, 0.0, 0.0 );
	vec3 n;
	
	n.x = map(p+e.xyy) - map(p-e.xyy);
	n.y = map(p+e.yxy) - map(p-e.yxy);
	n.z = map(p+e.yyx) - map(p-e.yyx);
	
	return normalize(n);
	
}
void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -= .5;
	uv.x *= resolution.x / resolution.y;
	vec3 dir = vec3( uv, 1.0 );
	dir = normalize(dir);
	
	vec3 pos = vec3( .0, 10., .0);
	
	float nbIterF = 0.;
	float result;
	for (float i =0.0; i < NB_ITER; i++)
	{
		result = map( pos );
		pos += result * dir;
		if ( (pos.z > FAR) || (abs(result) < 0.001)) break;
		nbIterF += 1.0;	
	}
	vec3 col;
	if ( pos.z> FAR ) 
	{
		col = vec3(.0, .0, .8);
	}
	else
	{
		col = vec3( nbIterF/128.0 );
		vec3 pos = pos + result * dir;
		vec3 nor = calcNormal(pos);
		vec3 lig = normalize( vec3(1.0,0.8,0.6) );
		vec3 blig = vec3( -lig.x, lig.y, -lig.z );
		
		float con = 1.0;
		float amb = 0.5 + 0.5 * nor.y;
		float dif = max( 0.0, dot(nor, lig) );
		float bac = max( 0.0, 0.2 + 0.8 * dot(nor, blig) );
		float sha = softShadow(pos, blig);
		
		//col += con * vec3(0.1, 0.15, 0.2);
		col += amb * vec3(0.1, 0.15, 0.2);
		col += bac * vec3(1.0, 0.97, 0.85);
		col += sha * vec3(0.8,0.8,0.8);
		
		//col = col * 0.3 + 0.7 * sqrt(col);
		col *= 0.5;
		
	}
	gl_FragColor = vec4( col, 1.0);
}