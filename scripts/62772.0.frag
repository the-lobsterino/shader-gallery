/*
 * Original shader from: https://www.shadertoy.com/view/4tf3Rl
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// EVERY THING COOL COMES FROM:`
//Fast Edge detection by nimitz (twitter: @stormoid)
//https://www.shadertoy.com/view/4s2XRd

// Also IQ:
// http://www.iquilezles.org/www/index.htm
// https://www.shadertoy.com/user/iq


#define EDGE_SIZE 0.14
#define SMOOTH 0.01

#define ITR 120
#define FAR 40.
//#define time iTime

vec4 spherePos[10];

void init_spherePos()
{
    for( int i =0; i < 10; i++ ){
        
        float x = 1. * cos(iTime *.13 * (float( i )+2.));
        float y = 1. * sin(iTime * .075 * (float( i )+4.));
        float z = 1. * sin(iTime * .1 * (float( i )+3.3));
        float r = .2 * ( sin( iTime * .1  *( float( i) +1.))+2.);
    	spherePos[i] = vec4( x ,  y ,  z , r  );
    }
}

float hash( float n ) { return fract(sin(n)*43758.5453); }

// exponential smooth min (k = 32);
float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float opBlend( vec2 d1, vec2 d2 )
{

    return smin( d1.x , d2.x , 8.);
}

float sdSphere( vec3 p, float s){
	return length( p ) - s * 1.;
}

vec2 map(vec3 pos)
{
	
   	vec2 res = vec2( 10000. , 0.);// vec2( sdPlane( pos - vec3( 0. , -1. , 0. )), 0.0 );
   
    for( int i = 0; i < 10; i++ ){
   		
        vec2 res2 = vec2( sdSphere( (pos - spherePos[i].xyz) , spherePos[i].w ) , float(i) + 1.);
        //vec2 res2 = vec2( udRoundBox( (pos - spherePos[i].xyz) , vec3( spherePos[i].w  ) ,spherePos[i].w * .2 ) , float(i) + 1.);
   		res.x = opBlend( res ,  res2 );
        
   	}
    
   	return res;
    	
}




//Fast Edge detection by nimitz (twitter: @stormoid)
//https://www.shadertoy.com/view/4s2XRd
/*	
	Keeping track of min distance, then, when the min distance 
	is both under a given threshold and starts increasing (meaning that
	a fold was just passed) then I mark that pixel as an edge. The min
	distance can then be smoothed allowing for arbitrarily smooth edges.
*/
vec4 calcIntersection(in vec3 ro, in vec3 rd)
{
	float precis = 0.01;
    float h=precis*2.0;
    vec2 d = vec2(0.,10000.);
    float md = 1.;
    float id = 0.;;
    bool stp = false;
    for( int i=0; i<ITR; i++ )
    {
        if( abs(h)<precis || d.x>=FAR ) break;
        d.x += h;
	   	vec2 res = map(ro+rd*d.x);
        if (!stp) 
        {
            md = min(md,res.x);
            if (h < EDGE_SIZE && h < res.x && i>0)
            {
                stp = true;
                d.y = d.x;
            }
        }
        h = res.x;
        id = res.y;
    }
    
    if (stp) md = smoothstep(EDGE_SIZE-SMOOTH, EDGE_SIZE+0.01, md);
    else md = 1.;
	return vec4(d, md, id);
}



//----
// Camera Stuffs
//----
mat3 calcLookAtMatrix( in vec3 ro, in vec3 ta, in float roll )
{
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(roll),cos(roll),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    return mat3( uu, vv, ww );
}

void doCamera( out vec3 camPos, out vec3 camTar, in float time, in float mouseX )
{
    float an = 0.3 + 10.0*mouseX;
	camPos = vec3(3.5*sin(an),1.0,3.5*cos(an));
    camTar = vec3(0.0,0.0,0.0);
}

// Calculates the normal by taking a very small distance,
// remapping the function, and getting normal for that
vec3 calcNormal( in vec3 pos ){
    
	vec3 eps = vec3( 0.001, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<30; i++ )
    {
        float hr = 0.01 + 0.612*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.5;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
    init_spherePos();
    
    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;
    vec2 m = iMouse.xy/iResolution.xy;

    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------
    
    // camera movement
    vec3 ro, ta;
    doCamera( ro, ta, iTime, m.x );

    // camera matrix
    mat3 camMat = calcLookAtMatrix( ro, ta, 0.0 );  // 0.0 is the camera roll
    
	// create view ray
	vec3 rd = normalize( camMat * vec3(p.xy,2.0) ); // 2.0 is the lens length
    
    vec4 res = calcIntersection( ro , rd  );

    vec3 col = vec3( 1. , 0. , 0. );
    
    if ( res.x < FAR )
    {
        vec3 pos = ro+res.x*rd;
        float d = distance(ro,pos);
        vec3 nor= calcNormal(pos);
        
        float amb = calcAO( pos,  nor );
        float match = max( 0. , dot( -nor , rd ));

      
        col = vec3(amb * match )*vec3( 1., .2, .2 ) *(1.-res.z); //* vec3(res.z); //(nor * .5 +.5);
        col += ( nor * .5 +.5)* vec3( 0.2 , .2 , 1.) * vec3(amb * (1.-match) );
    }else{
    
        vec3 pos = ro+res.x*rd;
        float d = distance(ro,pos);
        vec3 nor= calcNormal(pos);
       
        float bg = 1. - res.z;
       // col = nor * .5 + .5;
 		col = vec3( 1., .8 , .2 ) * vec3( bg ); //+ vec3(1. , 0. , 0. ) * res.z;
        
    }

	
	fragColor = vec4( col, 1.0 );
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}