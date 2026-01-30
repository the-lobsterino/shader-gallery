/*
 * Original shader from: https://www.shadertoy.com/view/llSGzz
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
// ALL TAKEN FROM IQs AMAZING SITE / TUTORIALS / SHADERS:
// http://www.iquilezles.org/www/index.htm
// https://www.shadertoy.com/user/iq

const float MAX_TRACE_DISTANCE = 10.0;           // max trace distance
const float INTERSECTION_PRECISION = .001;        // precision of the intersection
const int NUM_OF_TRACE_STEPS = 40;
	
vec4 spherePos[20];
  
// Taken from https://www.shadertoy.com/view/4ts3z2
float tri(in float x){return abs(fract(x)-.5);}
vec3 tri3(in vec3 p){return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));}
                                 

// Taken from https://www.shadertoy.com/view/4ts3z2
float triNoise3D(in vec3 p, in float spd)
{
    float z=1.4;
	float rz = 0.;
    vec3 bp = p;
	for (float i=0.; i<=3.; i++ )
	{
        vec3 dg = tri3(bp*2.);
        p += (dg+iTime*.1*spd);

        bp *= 1.8;
		z *= 1.5;
		p *= 1.2;
        //p.xz*= m2;
        
        rz+= (tri(p.z+tri(p.x+tri(p.y))))/z;
        bp += 0.14;
	}
	return rz;
}

vec3 hsv(float h, float s, float v)
{
  return mix( vec3( 1.0 ), clamp( ( abs( fract(
    h + vec3( 3.0, 2.0, 1.0 ) / 3.0 ) * 6.0 - 3.0 ) - 1.0 ), 0.0, 1.0 ), s ) * v;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 noiseVec( vec3 p ){
    
    float x = rand( p.xy );
    float y = rand( p.yz);
    float z = rand( p.zx );
 
    return normalize(normalize(vec3( x , y , z )) - vec3( .5 ));
    
}

vec4 texCube( sampler2D sam, in vec3 p, in vec3 n, in float k )
{
	vec4 x = texture( sam, p.yz );
	vec4 y = texture( sam, p.zx );
	vec4 z = texture( sam, p.xy );
    vec3 w = pow( abs(n), vec3(k) );
	return (x*w.x + y*w.y + z*w.z) / (w.x+w.y+w.z);
}


float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

float sdPlane( vec3 p )
{
    
    float f = sin( p.z * 5. ) * sin( p.x * 5. );
    //f = 5. * smoothstep( abs(f) , 0.4 , 0.8 );
	return p.y - (abs( f) * .3)/ max( 1. , pow( length( p ), 1.));

}



float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}


float sdNoiseSphere( vec3 p, float s )
{
  return length(p)-( s * (1.3 + .3 * triNoise3D( p * .2, 1. ) ));
}


float sdCone( in vec3 p, in vec3 c )
{
    vec2 q = vec2( length(p.xz), p.y );

    float d1 = -p.y-c.z;
    float d2 = max( dot(q,c.xy), p.y);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);

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




// checks to see which intersection is closer
// and makes the y of the vec2 be the proper id
vec2 opU( vec2 d1, vec2 d2 ){
    
	return (d1.x<d2.x) ? d1 : d2;
    
}

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
//--------------------------------
// Modelling 
//--------------------------------
vec2 map( vec3 pos ){  
    
    //pos = mod( pos + .5 , 1. ) - .5 ;
   	vec2 res = vec2( 10000. , 0.);// vec2( sdPlane( pos - vec3( 0. , -1. , 0. )), 0.0 );
   
    
    for( int i = 0; i < 20; i++ ){
   		
        vec2 res2 = vec2( sdSphere( (pos - spherePos[i].xyz) , .2 ) ,  .1);
        //vec2 res2 = vec2( udRoundBox( (pos - spherePos[i].xyz) , vec3( spherePos[i].w  ) ,spherePos[i].w * .2 ) , float(i) + 1.);
   		res.x = opBlend( res ,  res2 );
        
   	}
    
    vec2 res2 = vec2( sdNoiseSphere( (pos) , .6 ) , 3.);
    
    res = opU( res , res2 );
    
   	return res;
    
}



vec2 calcIntersection( in vec3 ro, in vec3 rd ){

    
    float h =  INTERSECTION_PRECISION*2.0;
    float t = 0.0;
	float res = -1.0;
    float id = -1.;
    
    for( int i=0; i< NUM_OF_TRACE_STEPS ; i++ ){
        
        if( h < INTERSECTION_PRECISION || t > MAX_TRACE_DISTANCE ) break;
	   	vec2 m = map( ro+rd*t );
        h = m.x;
        t += h;
        id = m.y;
        
    }

    if( t < MAX_TRACE_DISTANCE ) res = t;
    if( t > MAX_TRACE_DISTANCE ) id =-1.0;
    
    return vec2( res , id );
    
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


float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<50; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, 20.*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );

}


float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.612*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.5;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    

    for( int i =0; i < 20; i++ ){
        
        float x = 1. * cos(iTime *.13 * (float( i )+2.));
        float y = 1. * sin(iTime * .075 * (float( i )+4.));
        float z = 1. * sin(iTime * .1 * (float( i )+3.3));
        float r = .1 * ( sin( iTime * .1  *( float( i) +1.))+2.);
        
        vec3  p = vec3( x , y , z );
        p = normalize( p ) * 1.3;
        
    	spherePos[i] = vec4( p.x ,  p.y ,  p.z , .2  );
        
        
    }

    
    
    
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
    
    vec2 res = calcIntersection( ro , rd  );
    
    
    vec3 lightPos = vec3( 2. , 1. , 0. );
    
    vec3 col = vec3( 0. );//vec3( .8 , .8 , .8 ); 
   
    // If we have hit something lets get real!
    if( res.y > -.5 ){

        vec3 pos = ro + rd * res.x;
        vec3 nor = calcNormal( pos );

        vec3 lightDir = lightPos - pos;
        lightDir = normalize( lightDir );
        
        vec3 lightRefl = reflect( lightDir , nor );
        float reflMatch = pow( max( 0. , dot( rd , lightRefl )) , 10. );
        


        float AO = calcAO( pos , nor );

        float match = max( 0. , dot( nor , lightDir ));
        
        float rim = pow( 1. - max( 0. , dot( -nor , rd ) ) , 5.);

        if( res.y < 2. ){
    
           // float c = pow(( 1.-AO) , 5.)*  10.;
            float c = 0.;
            //c += pow((1.- match),4.) * 1.;
            c += pow(( 1.-AO) , 5.)*  2.;
           // col = vec3( c );// * .4 * ( nor * .5 + .5 );

           // col = hsv( c ,1.,1.) * c;
            col += vec3( 1. , .2 , 0.6 ) * pow(( 1.-AO) , 2.); 
            col += vec3( 1. , .8, .2 ) * rim;
            col += vec3( .3 , .5 , 1. ) * reflMatch;
            
            //* pow( match , 3.) * hsv(abs(sin(match*1.)) , 1. , 1. );
            //col += pow( shinyMatch , 5. ) * hsv(abs(sin(shinyMatch*10.)) , 1. , 1. );
        }else{
          
        	vec3 refl = normalize( reflect( rd , nor ));
            
            vec3 ro2 = pos + refl * .01;
            vec3 rd2 = refl;
            
            vec2 res2 = calcIntersection( ro2 , rd2  );
            
            col += vec3( 1. , .8 , .2 ) * rim;
            
            if( res2.y > -.5 ){
                
                
                

                vec3 pos2 = ro2 + rd2 * res2.x;
        		vec3 nor2 = calcNormal( pos2 );

                vec3 lightDir = lightPos - pos2;
                lightDir = normalize( lightDir );

                vec3 lightRefl = reflect( lightDir , nor2 );
                float reflMatch = pow( max( 0. , dot( rd2 , lightRefl )) , 10. );
                
                float AO = calcAO( pos2 , nor2 );
                col += vec3( 1. , .2 , .6 ) * pow(( 1.-AO) , 2.); 
                
                float r2 = pow( 1. - max( 0. , dot( -nor2 , rd2 ) ) , 5.);
                col += vec3( 1. , .8 , .2 ) * r2;
                
                col += vec3( .3 , .5 , 1. ) * reflMatch;
            
            }
            
          
            
        }
        //col = vec3( shinyMatch );
       /* if( res.y < .5 ){
            
            float f = sin( pos.z * 5. ) * sin( pos.x * 5. );
            //col *= 5. * smoothstep( abs(f) , 0.4 , 0.8 );
            col *= abs( f );
            col /= pow( length( pos ), 4.);
        }*/
    }
    // apply gamma correction
    col = pow( col, vec3(0.4545) );

    fragColor = vec4( col , 1. );
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}