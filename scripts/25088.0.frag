#ifdef GL_ES
//precision mediump float;
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



#define NB_ITER 256
#define FAR 	500.


//#define EDIT

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
	//vec4 ret = vec4( abs(atan (pos.x ) ) *abs(atan (pos.y ) )  );
	//float m = smoothstep( 0., 1.5, abs(pos.y) -1.5 );
	//ret = mix ( ret, vec4( 0., 1., 0., 0.), m );
	//vec4 ret = vec4(fract( pos.z ) > .5);
	float DEP_VAL =sin(time) +2.;
	float dist = length(  pos ) - 5.+ .2*sin(DEP_VAL *pos.x + sin(5.*time)) * sin(DEP_VAL *pos.y+ cos(6.*time)) * sin(DEP_VAL *pos.z+ sin(time));
	vec3 col = vec3( 1.0, .2, .2 );
	return  vec4( col, dist);
}


float Mylength( vec3 pos )
{
	return max(abs(pos.x), max( abs(pos.y), abs( pos.z)) );
}

float Mylength2( vec3 pos )
{
	return abs(pos.x) + abs(pos.y) + abs( pos.z);
}

vec4 mapCube( vec3 pos )
{
	//vec4 ret = vec4( abs(atan (pos.x ) ) *abs(atan (pos.y ) ), .0, .0, 1.  );
	//vec4 ret = vec4(fract( pos.z ) > .5);
	vec3 col = vec3( .0, .9, .1);
	float dist = Mylength(  pos ) - 5.0;
	return vec4( col, dist );
}


vec4 combine(vec4 val1, vec4 val2 )
{
	if ( val1.w < val2.w ) return val1;
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


//#define MOVING_OBJECTS
vec4 map( vec3 pos)
{
	/*
	vec4 val1= mapFloor( pos );
#ifdef MOVING_OBJECTS
	vec4 val2 = mapSphere(pos + vec3( 10.*sin(time), -5. + sin(time*10.), -50. + 10.*cos(time) ) );
	vec4 val3 = mapSphere(pos + vec3( 10.*sin(time + 2.), -5.+ sin(time*10. + 7.), -50. + 10.*cos(time+2.) ) );
	//vec4 val4 = mapSphere(pos + vec3( 10.*sin(time + 4.), -5.+ sin(time*10. + 1.), -50. + 10.*cos(time+4.) ) );
	vec4 val4 = mapCube(pos + vec3( 10.*sin(time + 4.), -5.+ 10.*sin(time*5. +1.), -50. + 10.*cos(time+4.) ) );
#else
	vec4 val2 = mapSphere(pos + vec3( .0, -5., -50.) );
	//vec4 val3 = mapSphere(pos + vec3( 10.*sin(2.), -5., -50. + 10.*cos(2.) ) );
	//vec4 val4 = mapCube(pos + vec3( 10.*sin(4.), -20.+ 10.*sin(1.), -50. + 10.*cos(4.) ) );
#endif
	
	//vec4 val5 = combine ( val2, val3 );
	//vec4 val6 = combine ( val4, val5 );
	//vec4 val7 = combine ( val6, mapLotsOfCubes(pos) );
*/
	pos += vec3(10.0, 0., .0);
	
	pos += vec3( 1.*sin(pos.z), cos(pos.z), .0);
	const float radius=6.0;
	float dist = length( mod( pos+15., 30.)-15.) -radius;

	
	/*float dist = sin( .1*pos.x ) + cos( .07*pos.y ) + sin( pos.z )+.5;
	dist += .5*sin(.6*pos.z * .04*pos.x * .03*pos.y);
	//dist += .006*max(abs(pos.x), abs(pos.y) );
*/
	vec3 col1 = vec3( 1., 0., 0.);
	vec3 col2 = vec3( 0., 1., 0.);
	float val = sign( fract( .25*pos.x) -.5 ) * sign( fract( .25*pos.z) -.5 );
	vec3 col =mix( col1, col2, val );

	return vec4( col, dist );
	//return combine( val1, va90);
}

vec4 pixel3D( void ) {
#ifdef EDIT
	gl_FragColor = vec4( .1);
#else
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -= .5;
	uv.x *= resolution.x / resolution.y;
	//uv.x += cos( uv.x)*3.02;
	//float fish_eye =  -length(uv)*1.;
	float fish_eye =  .0;
	vec3 dir = vec3( uv, 1.0 + fish_eye);
	dir = normalize(dir);
	
	//vec3 pos = vec3( .0, 8.1, .0);
	vec3 pos = vec3( 5.+10.*sin(.5*time), 7.1, 20.*cos(.2*time));
	
	float nbIterF = 0.;
	vec4 result;
	for (int i =0; i < NB_ITER; i++)
	{
		result = map( pos );
		pos += result.w * dir;
		if ( (pos.z > FAR) || (abs(result.w) < .001)) break;
		//if ( (pos.z > FAR)) break;
		nbIterF += 1.0;	
	}
	vec3 col = result.xyz;
	if ( pos.z> FAR ) 
	{
		col = vec3(.0, .0, .8);
	}
	else
	{
		vec3 lightPos = vec3(10.* sin(3.*time) + 10., 8.5, 10.*cos(3.*time) + 3. );
		vec3 light2Pos = normalize( lightPos - pos);
		vec3 eps = vec3( .1, .0, .0 );
		vec3 n = vec3( result.w - map( pos - eps.xyy ).w,
			       result.w - map( pos - eps.yxy ).w,
			       result.w - map( pos - eps.yyx ).w );
		n = normalize(n);
		//col =abs(n);
				
		float lambert = max(.0, dot( n, light2Pos));
		col *= vec3(lambert);
		
		//vec3 light = vec3( sin( time ), 20 , cos(time) );
		//col = col* vec3(dot ( -dir, n ));
		
		// specular : 
		vec3 h = normalize( -dir + light2Pos);
		float spec = max( 0., dot( n, h ) );
		col += vec3(pow( spec, 16.)) ;
		
	}
	//vec3 col = vec3( nbIterF/64. );
	return vec4( col, 1.0);
#endif
}
// combining everything : 
float Mylength(vec2 pos)
{
	return max(abs(pos.x), abs(pos.y));
}

vec4 pixel2D(vec2 uv )
{
		float val1 = sin(cos(3.*time) +  length(40.*(mod(3.*uv, 1.)-.5)));
	float val2 = sin(cos(5.*time) +  Mylength(40.*(mod(4.*uv, 1.)-.5)));
	float val3 = length(sin(20.*uv)+sin(10.*time));

	
	vec3 finalColor1 = vec3( val1 * val2+val3, val1+val2, val2-val1 );

	return vec4(finalColor1, 1.);
}
float spiral(vec2 uv )
{
	const float PI = 3.14159265358979323846264;
	float a = atan(uv.x, uv.y ) * 6./PI;
	float r = length(uv);
	float twist = fract(4.*r+time+a);
	return float(twist > .5);
}

void main(void)
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -=.5;
	//uv.x += sin(time)*.005*cos( 80.*uv.y + 10.*time);
	//uv.x += cos(uv.x * .5*sin(2.*time));
	//uv.y += cos(uv.y * cos(time));
	uv.x *= resolution.x/ resolution.y;
/*
	float spirVal = spiral( uv );
	vec4 pixVal;
	if ( spirVal > 0. )
		pixVal = pixel3D();
	else
		//pixVal = pixel2D( uv);
		pixVal = pixel3D( );
	*/
	//gl_FragColor = pixVal;
//	gl_FragColor = vec4(.2);
	gl_FragColor = pixel3D();
//	
}

