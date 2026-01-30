// Created by Reinder Nijhoff 2014

// From https://www.shadertoy.com/view/MtfGR4

// Adapted to use GLSL Sandbox backbuffer for accumulation


#ifdef GL_ES
precision highp float;
#endif


float maxaa=128.0;


uniform vec2 resolution;
uniform float time;
uniform sampler2D backbuffer;
uniform vec2 mouse;

vec2 iResolution=resolution;
float iGlobalTime=time;



float PI=3.14159265;
#define eps 0.0001
#define LIGHTPATHLENGTH 2
#define EYEPATHLENGTH 3
#define MAXPATHLENGTH 4
#define SAMPLES 12

#define FULLBOX

#define DOF
#define ANIMATENOISE
#define MOTIONBLUR

#define MOTIONBLURFPS 12.

#define LIGHTCOLOR vec3(16.86, 10.76, 8.2)*1.3
#define WHITECOLOR vec3(.7295, .7355, .729)*0.7
#define GREENCOLOR vec3(.117, .4125, .115)*0.7
#define REDCOLOR vec3(.611, .0555, .062)*0.7

struct LightPathNode {
    vec3 color;
    vec3 position;
    vec3 normal;
};
    
float seed = iGlobalTime;

float rand3d_1d(vec3 co){
    return fract(sin(dot(co.xyz,vec3(27.2344,98.2142,57.2324)))*43758.5453)-0.5;
}


float hash1() {
    return fract(sin(seed += 0.1)*43758.5453123);
}

vec2 hash2() {
    return fract(sin(vec2(seed+=0.1,seed+=0.1))*vec2(43758.5453123,22578.1459123));
}

vec3 hash3() {
    return fract(sin(vec3(seed+=0.1,seed+=0.1,seed+=0.1))*vec3(43758.5453123,22578.1459123,19642.3490423));
}

//-----------------------------------------------------
// Intersection functions (by iq)
//-----------------------------------------------------

vec3 nSphere( in vec3 pos, in vec4 sph ) {
    return (pos-sph.xyz)/sph.w;
}

float iSphere( in vec3 ro, in vec3 rd, in vec4 sph ) {
    vec3 oc = ro - sph.xyz;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - sph.w*sph.w;
    float h = b*b - c;
    if( h<0.0 ) return -1.0;
    return -b - sqrt( h );
}

vec3 nPlane( in vec3 ro, in vec4 obj ) {
    return obj.xyz;
}

float iPlane( in vec3 ro, in vec3 rd, in vec4 pla ) {
    return (-pla.w - dot(pla.xyz,ro)) / dot( pla.xyz, rd );
}

//-----------------------------------------------------
// scene
//-----------------------------------------------------

vec3 cosWeightedRandomHemisphereDirection( const vec3 n ) {
    vec2 rv2 = hash2();
    
    vec3  uu = normalize( cross( n, vec3(0.0,1.0,1.0) ) );
    vec3  vv = normalize( cross( uu, n ) );
    
    float ra = sqrt(rv2.y);
    float rx = ra*cos(6.2831*rv2.x); 
    float ry = ra*sin(6.2831*rv2.x);
    float rz = sqrt( 1.0-rv2.y );
    vec3  rr = vec3( rx*uu + ry*vv + rz*n );
    
    return normalize( rr );
}

vec3 randomHemisphereDirection( const vec3 n ) {
    vec2 r = hash2()*6.2831;
    vec3 dr=vec3(sin(r.x)*vec2(sin(r.y),cos(r.y)),cos(r.x));
    return dot(dr,n) * dr;
}

//-----------------------------------------------------
// renderer
//-----------------------------------------------------

vec4 lightSphere;
LightPathNode lpNodes[LIGHTPATHLENGTH];

void initLightSphere( float time ) {
    time=3.0;
    lightSphere = vec4( 3.0+2.*sin(time),2.8+2.*sin(time*0.9),3.0+4.*cos(time*0.7),0.5);
}

vec2 intersect( in vec3 ro, in vec3 rd, inout vec3 normal ) {
    vec2 res = vec2( 1e20, -1.0 );
    float t;
    
    t = iPlane( ro, rd, vec4( 0.0, 1.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = vec3( 0., 1., 0.); }
    t = iPlane( ro, rd, vec4( 0.0, 0.0,-1.0,8.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = vec3( 0., 0.,-1.); }
    t = iPlane( ro, rd, vec4( 1.0, 0.0, 0.0,0.0 ) ); if( t>eps && t<res.x ) { res = vec2( t, 2. ); normal = vec3( 1., 0., 0.); }
#ifdef FULLBOX
    t = iPlane( ro, rd, vec4( 0.0,-1.0, 0.0,5.49) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = vec3( 0., -1., 0.); }
    t = iPlane( ro, rd, vec4(-1.0, 0.0, 0.0,5.59) ); if( t>eps && t<res.x ) { res = vec2( t, 1. ); normal = vec3(-1., 0., 0.); }
#endif

    t = iSphere( ro, rd, vec4( 1.5,1.0, 2.7, 1.0) ); if( t>eps && t<res.x ) { res = vec2( t, 0. ); normal = nSphere( ro+t*rd, vec4( 1.5,1.0, 2.7,1.0) ); }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0, 1.0) ); if( t>eps && t<res.x ) { res = vec2( t, 2. ); normal = nSphere( ro+t*rd, vec4( 4.0,1.0, 4.0,1.0) ); }
    t = iSphere( ro, rd, lightSphere ); if( t>eps && t<res.x ) { res = vec2( t, 4.0 );  normal = nSphere( ro+t*rd, lightSphere ); }
                      
    return res;                   
}

bool intersectShadow( in vec3 ro, in vec3 rd, in float dist ) {
    float t;
    
    t = iSphere( ro, rd, vec4( 1.5,1.0, 2.7,1.0) );  if( t>eps && t<dist ) { return true; }
    t = iSphere( ro, rd, vec4( 4.0,1.0, 4.0,1.0) );  if( t>eps && t<dist ) { return true; }

    return false; // optimisation: planes don't cast shadows in this scene
}

vec3 calcColor( in float mat ) {
    vec3 nor = vec3(0.0);
    
    if( mat<4.5 ) nor = LIGHTCOLOR;
    if( mat<3.5 ) nor = WHITECOLOR;
    if( mat<2.5 ) nor = GREENCOLOR;
    if( mat<1.5 ) nor = REDCOLOR;
    if( mat<0.5 ) nor = WHITECOLOR;
                      
    return nor;                   
}

//-----------------------------------------------------
// lightpath
//-----------------------------------------------------

void constructLightPath() {
    vec3 ro = normalize( hash3()-vec3(0.5) );
    vec3 rd = randomHemisphereDirection( ro );
    ro = lightSphere.xyz + ro*0.5;
    vec3 color = LIGHTCOLOR;
    
    lpNodes[0].position = ro;
    lpNodes[0].color = color;
    lpNodes[0].normal = rd;
    
    for( int i=1; i<LIGHTPATHLENGTH; ++i ) {
        lpNodes[i].position = lpNodes[i].color = lpNodes[i].normal = vec3(0.);
    }
    
    for( int i=1; i<LIGHTPATHLENGTH; i++ ) {
        vec3 normal;
        vec2 res = intersect( ro, rd, normal );
        if( res.y > -0.5 && res.y < 4. ) {
            ro = ro + rd*res.x;
            color *= calcColor( res.y );
            lpNodes[i].position = ro;
            lpNodes[i].color = color;
            lpNodes[i].normal = normal;

            rd = cosWeightedRandomHemisphereDirection( normal );
        } else break;
    }
}

//-----------------------------------------------------
// eyepath
//-----------------------------------------------------

vec3 traceEyePath( in vec3 ro, in vec3 rd ) {
    vec3 col = vec3(0.);
    vec3 basecol = vec3(1.);
    
    for( int j=0; j<EYEPATHLENGTH; ++j ) {
        vec3 normal;
        
        vec2 res = intersect( ro, rd, normal );
        if( res.y < -0.5 ) return col;
        if( res.y > 3.5 ) {
            return col + basecol*LIGHTCOLOR / float( j+1 ); 
        }
        
        ro = ro + res.x * rd;
        rd = cosWeightedRandomHemisphereDirection( normal );
        
        basecol *= calcColor( res.y );
        
        for( int i=0; i<LIGHTPATHLENGTH; ++i ) {
            if( i+j >= MAXPATHLENGTH ) continue;
            
            vec3 lp = lpNodes[i].position - ro;
            vec3 lpn = normalize( lp );
            vec3 lc = lpNodes[i].color;
            
            if( !intersectShadow(ro, lpn, length(lp)-eps) ) {
                col += clamp( dot( lpn, normal ), 0., 1.) * lc * basecol
                    * clamp(  dot( lpNodes[i].normal, -lpn ), 0., 1.)
                    * clamp( 1./dot(lp,lp), 0., 1. )
                    / float( i+j+1 );
            }
        }
    }    
    return col;
}

//-----------------------------------------------------
// main
//-----------------------------------------------------

void main( void ) {
    if (time<1.0) maxaa=1.0; else maxaa=16.0;
    vec2 q = gl_FragCoord.xy / iResolution.xy;
    vec2 position = ( gl_FragCoord.xy / resolution.xy );
    vec4 backpixel = texture2D(backbuffer, position); 
    
    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------

    vec2 p = -1.0 + 2.0 * (gl_FragCoord.xy) / iResolution.xy;
    p.x *= iResolution.x/iResolution.y;

#ifdef ANIMATENOISE
    seed = p.x + fract(p.y * 18753.43121412313) + fract(12.12345314312*iGlobalTime);
#else
    seed = p.x + fract(p.y * 18753.43121412313);
#endif
 
    vec3 ta = vec3(2.78, 2.73,0.0);
    float mx=mouse.x*PI*2.0*0.2+1.1;
    float my=mouse.y*PI/2.01*0.4-0.4; 
    vec3 ro=ta-vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*4.0;
   
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    //-----------------------------------------------------
    // render
    //-----------------------------------------------------

    vec3 col = vec3(0.0);
    vec3 tot = vec3(0.0);
    vec3 uvw = vec3(0.0);

    for( int a=0; a<SAMPLES; a++ ) {
        
        vec2 rpof = 4.*(hash2()-vec2(0.5)) / iResolution.xy;
        vec3 rd = normalize( (p.x+rpof.x)*uu + (p.y+rpof.y)*vv + 3.0*ww );
        
#ifdef DOF
        vec3 fp = ro + rd * 12.0;
        vec3 rof = ro + (uu*(hash1()-0.5) + vv*(hash1()-0.5))*0.125;
        rd = normalize( fp - rof );
#else
        vec3 rof = ro;
#endif        
        
#ifdef MOTIONBLUR
        initLightSphere( iGlobalTime + hash1() / MOTIONBLURFPS );
#else
        initLightSphere( iGlobalTime );        
#endif
        
        constructLightPath();
        col = traceEyePath( rof, rd );

        tot += col;
        
        seed = mod( seed*1.1234567893490423, 13. );
    }
    
    tot /= float(SAMPLES);

    tot = pow( clamp(tot,0.0,1.0), vec3(0.45) );

    vec3 finalColor=tot*(1.0/maxaa)+backpixel.xyz*((maxaa-1.0)/maxaa);
    //finalColor+=rand3d_1d(vec3(position*time,time))*(0.5/maxaa);

    gl_FragColor=vec4(finalColor,1.0);
}