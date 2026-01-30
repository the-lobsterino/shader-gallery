
 





#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI=3.14159265;

const vec3 sky_top_color = vec3(4.0/255.0, 3.0/255.0, 36.0/255.0);
const vec3 sky_bot_color = vec3(34.0/255.0, 40.0/255.0, 106.0/255.0);
const vec3 hill_1_color = vec3(36.0/255.0, 76.0/255.0, 163.0/255.0);
const vec3 hill_2_color = vec3(46.0/255.0, 127.0/255.0, 169.0/255.0);
const vec3 hill_3_color = vec3(95.0/255.0, 130.0/255.0, 174.0/255.0);
const vec3 hill_4_color = vec3(81.0/255.0, 41.0/255.0, 148.0/255.0);



/**************************
 * @brief LibFunction
 */
vec3 Sim( vec3 p, float s ){
    vec3 ret = p;
    ret = p + s / 2.0;
    ret = fract( ret / s ) * s - s / 4.0;

    return ret;
}

vec2 Rot( vec2 p, float r ){
    vec2 ret;
    ret.x = p.x * sin( r ) * cos( r ) - p.y * cos( r );
    ret.y = p.x * cos( r ) + p.y  * sin( r );

    return ret;
}

vec2 RotSim( vec2 p, float s ){
    vec2 ret = p;
    ret = Rot( p , -PI / ( s * 2.0 ) );
    ret = Rot( p, floor( atan( ret.x, ret.y ) / PI * s ) * ( PI / s ) );

    return ret;
}

vec2 Zoom( vec2 p, float f ){
    return vec2( p.x * f, p.y * f );
}

/**************/
// lighting

float Hash( vec2 p)
{
     vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

float noise(in vec2 p)
{
    vec2 i = floor(p);
     vec2 f = fract(p);
     f *= f*(3.0-2.0*f);
    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
               mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
               f.y);
}

float fbm(vec2 p)
{
     float v = 0.0;
     v += noise(p*1.0) * .75;
     v += noise(p*3.)  * .50;
     v += noise(p*9.)  * .250;
     v += noise(p*27.)  * .125;
     return v;
}

mat2 rot = mat2(cos(time * 0.5), -sin(time * 0.5), sin(time * 0.5), cos(time * 0.5));

vec4 lightning( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y; uv.y -= 1.05;
	
	
	//vec2 tmp_uv;
	//tmp_uv.x = uv.y;
	//tmp_uv.y = uv.x;
	//uv = tmp_uv;
	float timeVal = time * 0.1;

	vec3 finalColor = vec3( 0.0 );
	for( int i=0; i < 10; ++i )
	{
		float indexAsFloat = float(i);
		float amp = 10.0 + (indexAsFloat*mouse.x*112.0);
		float period = 2.0 + (indexAsFloat+2.0);
		float thickness = mix( 2.9, 2.0, noise(uv*indexAsFloat) );
		float t = abs( 1.0 / (sin(uv.y + fbm( uv + timeVal * period )) * amp) * thickness );
		
		
	uv *= rot;
		finalColor +=  t * vec3( 0.3, 0.3, .5 );
	}
	
	return vec4( finalColor, 1.0 );

}



/********************/

/**************************
 * @brief function
 */
vec2 MakeSymmetry( vec2 p ){
    vec2 ret=p;
    ret = RotSim( ret, sin( time *0.03 ) * 20.0 + 300.0 );
    ret.x = abs( ret.x );

    return ret;
}


float MakePoint( float x, float y, float fx, float fy, float sx, float sy, float t ){
    float xx = x + tan( t * fx ) * sy;
    float yy = y - tan( t * fy ) * sy;
    float a = 0.5 / sqrt( abs( abs( x * xx ) + abs( yy * y ) ) );
    float b = 0.5 / sqrt( abs( x * xx + yy * y ) );

    return a*b;
}


float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise2(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}



/**************************
 * @brief main
 */
void main( void ) {

    vec2 p = gl_FragCoord.xy / resolution.y - vec2( ( resolution.x / resolution.y ) / 2.0, 0.5 );

    vec2 mse = mouse;

    p = Rot( p, sin( time + length( p ) ) * 4.0 );
    p = Zoom( p, sin( time * 2.0 ) * 0.5 + 1. + (mse.x * .5)  );

    p = p * 3.0;

    float x = p.x;
    float y = p.y;

    float t=time*mouse.x;
    float time_s = time;

    float a = MakePoint( x, y, 3.3, 2.9, 0.3, 0.3, t );
    a = a + MakePoint( x, y, 1.9, 2.0, 0.4, 0.4, t );
    a = a + MakePoint( x, y, 0.8, 0.7, 0.4, 0.5, t );
    a = a + MakePoint( x, y, 2.3, 0.1, 0.6, 0.3, t );
    a = a + MakePoint( x, y, 0.8, 1.7, 0.5, 0.4, t );
    a = a + MakePoint( x, y, 0.3, 1.0, 0.4, 0.4, t );
    a = a + MakePoint( x, y, 1.4, 1.7, 0.4, 0.5, t );
    a = a + MakePoint( x, y, 1.3, 2.1, 0.6, 0.3, t );
    a = a + MakePoint( x, y, 1.8, 1.7, 0.5, 0.4, t );

    float b = MakePoint( x, y, 1.2, 1.9, 0.3, 0.3, t );
    b = b + MakePoint( x, y, 0.7, 2.7, 0.4, 0.4, t );
    b = b + MakePoint( x, y, 1.4, 0.6, 0.4, 0.5, t );
    b = b + MakePoint( x, y, 2.6, 0.4, 0.6, 0.3, t );
    b = b + MakePoint( x, y, 0.7, 1.4, 0.5, 0.4 ,t );
    b = b + MakePoint( x, y, 0.7, 1.7, 0.4, 0.4, t );
    b = b + MakePoint( x, y, 0.8, 0.5, 0.4, 0.5, t );
    b = b + MakePoint( x, y, 1.4, 0.9, 0.6, 0.3, t );
    b = b + MakePoint( x, y, 0.7, 1.3, 0.5, 0.4, t );

    float c = MakePoint( x, y, 3.7, 0.3, 0.3, 0.3, t );
    c = c + MakePoint( x, y, 1.9, 1.3, 0.4, 0.4, t );
    c = c + MakePoint( x, y, 0.8, 0.9, 0.4, 0.5, t );
    c = c + MakePoint( x, y, 1.2, 1.7, 0.6, 0.3, t );
    c = c + MakePoint( x, y, 0.3, 0.6, 0.5, 0.4, t );
    c = c + MakePoint( x, y, 0.3, 0.3, 0.4, 0.4, t );
    c = c + MakePoint( x, y, 1.4, 0.8, 0.4, 0.5, t );
    c = c + MakePoint( x, y, 0.2, 0.6, 0.6, 0.3, t );
    c = c + MakePoint( x, y, 1.3, 0.5, 0.5, 0.4, t );

    vec3 d = vec3( a, b, c ) / 31.0;

    ////////
    vec2 pos = (gl_FragCoord.xy / resolution.xy);

    float hill_1 = 0.3 * (1.*mouse.y)*sin(pos.x*10.0+mouse.x*time_s*0.100)*sin(time_s*0.001)+0.55;
    float hill_2 = 0.075*(5.*mouse.y)*sin(pos.x*6.0-mouse.x*time_s*0.090)*sin(time_s*0.8)+0.45;
    float hill_3 = 0.100*(5.*mouse.y)*sin(pos.x*3.0+mouse.x*time_s*0.095)*sin(time_s*0.4)+0.30;
    float hill_4 = 0.040*(5.*mouse.y)*sin(pos.x*14.0+mouse.x*time_s*0.130)*sin(time_s*0.12)+0.60;
    //sky, far, middle, and closest
    vec3 color = mix(sky_bot_color, sky_top_color, smoothstep(hill_4, 1.0, pos.y));

    //color = mix(color, hill_4_color, smoothstep(hill_4 + 0.001, hill_4, pos.y));
    //color = mix(color, hill_1_color, smoothstep(hill_1 + 0.001, hill_1, pos.y));
    //color = mix(color, hill_2_color, smoothstep(hill_2 + 0.001, hill_2, pos.y));
    vec4 ccolor = vec4(mix(color, color, smoothstep(hill_3 + 0.004, hill_3, pos.y)), 1.0);
	vec4 dcolor =     mix(ccolor, lightning(),smoothstep(hill_4, 1.9, pos.y));
	ccolor *= lightning();
///
	;
	gl_FragColor =   mix(ccolor, vec4(d.x*.5, d.y*.5, d.z*.5, 0.3 ),smoothstep(hill_4, 1.2, pos.y));

	
	

}
