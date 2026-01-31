//////////////////////////////////////////
#ifdef GL_ES 
//Cleaning up my code....   See U at TrSac www.trsac.dk
precision highp float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define NB_ITER 256
#define FAR 	100.
vec4 mapFloor ( vec3 pos )
{
	vec3 col1 = vec3( 1., 0., 0.);
	vec3 col2 = vec3( 0., 1., 0.);
	float val = sign( fract( .25*pos.x) -.5 ) * sign( fract( .25*pos.z) -.5 );
	vec3 col =mix( col1, col2, val );
	float dist = pos.y;
	return vec4( col, dist );
}
vec4 mapSphere( vec3 pos )
{
	float dist = length(  pos ) - 1.;// + 1.*sin(10.*pos.x) * sin(10.*pos.y) * sin(10.*pos.z);
	vec3 col = vec3( 1.0, .2, .2 );
	return  vec4( col, dist);
}
float Mylength( vec3 pos )
{	return max(abs(pos.x), max( abs(pos.y), abs( pos.z)) ); }

float Mylength2( vec3 pos )
{	return abs(pos.x) + abs(pos.y) + abs( pos.z); }

vec4 mapCube( vec3 pos )
{
	vec3 col = vec3( .0, .9, .1);
	float dist = Mylength(  pos ) - 5.0;
	return vec4( col, dist );
}
vec4 combine(vec4 val1, vec4 val2 )
{	if ( val1.w < val2.w ) return val1;
return val2;
}
vec4 mapLotsOfSpheres( vec3 pos)
{
	vec3 col = vec3(.3, .8, .2 );
	const float radius=6.0;
	float dist = length( mod( pos+15., 30.)-15.) -radius;
	return vec4( col, dist);
}
vec4 mapLotsOfCubes( vec3 pos)
{
	vec3 col = vec3(.3, .8, .2 );
	const float radius=6.0;
	float dist = Mylength( mod( pos+8., 16.)-8.) -radius;
	return vec4( col, dist);
}
#define MOVING_OBJECTS
vec4 map( vec3 pos)
{
	vec4 val1= mapFloor( pos );
#ifdef MOVING_OBJECTS
	vec4 val2 = mapSphere(pos + vec3( 10.*sin(time), -5. + sin(time*10.), -50. + 10.*cos(time) ) );
	vec4 val3 = mapSphere(pos + vec3( 10.*sin(time + 2.), -5.+ sin(time*10. + 7.), -50. + 10.*cos(time+2.) ) );
	vec4 val4 = mapCube(pos + vec3( 10.*sin(time + 4.), -5.+ 10.*sin(time*5. +1.), -50. + 10.*cos(time+4.) ) );
#else
	vec4 val2 = mapSphere(pos + vec3( .0, -5., -50.) );
	vec4 val3 = mapSphere(pos + vec3( 10.*sin(2.), -5., -50. + 10.*cos(2.) ) );
	vec4 val4 = mapCube(pos + vec3( 10.*sin(4.), -20.+ 10.*sin(1.), -50. + 10.*cos(4.) ) );
#endif
	vec4 val5 = combine ( val2, val3 );
	vec4 val6 = combine ( val4, val5 );
	vec4 val7 = combine ( val6, mapLotsOfCubes(pos) );
	return combine( val1, val7);
}

void main( void ) {
#ifdef EDIT
	gl_FragColor = vec4( .1);
#else
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -= .5;
	uv.x *= resolution.x / resolution.y;
	float fish_eye =  .0;
	vec3 dir = vec3( uv, 1.0 + fish_eye);
	dir = normalize(dir);
	vec3 pos = vec3( 20.*sin(time), 8.1, 20.*cos(time));
	float nbIterF = 0.;
	vec4 result;
	for (int i =0; i < NB_ITER; i++)
	{
		result = map( pos );
		pos += result.w * dir;
		if ( (pos.z > FAR) || (abs(result.w) < .001)) break;
		nbIterF += 1.0;	
	}
	vec3 col = result.xyz;
	if ( pos.z> FAR ) 
	{		col = vec3(.0, .0, .8);}
	else
	{
		vec3 lightPos = vec3(10.* sin(3.*time) + 10., 8.5, 10.*cos(3.*time) + 30. );
		vec3 light2Pos = normalize( lightPos - pos);
		vec3 eps = vec3( .1, .0, .0 );
		vec3 n = vec3( result.w - map( pos - eps.xyy ).w,result.w - map( pos - eps.yxy ).w,result.w - map( pos - eps.yyx ).w );
		n = normalize(n);
		float lambert = max(.0, dot( n, light2Pos));
		col *= vec3(lambert);
		vec3 h = normalize( -dir + light2Pos);
		float spec = max( 0., dot( n, h ) );
		col += vec3(pow( spec, 16.)) ;
		
	}
	gl_FragColor = vec4( col, 1.0);
#endif
}