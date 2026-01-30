// Merry Christmas!
// @memorystomp

// shader based on http://glsl.heroku.com/e#12313.0
// pixel art from this thread http://www.pixelgasm-forum.com/viewtopic.php?f=2&t=8#p32648
// colors from http://glsl.heroku.com/e#9143.0

// noise function lifted from http://glsl.heroku.com/e#11657.0

precision mediump float;
uniform vec2 resolution;
uniform float time;

#define BB 0.0
#define RR 1.0
#define PP 2.0
#define WW 3.0
#define GG 4.0

#define MKNum(a,b,c,d,e,f,g,h,i) (a+5.0*(b+5.0*(c+5.0*(d+5.0*(e+5.0*(f+5.0*(g+5.0*(h+5.0*i))))))))

// looks better, uses less memory and no arrays (hurray) - by iq & movAX13h
vec3 sample(in vec2 uv, vec3 original)
{
    ivec2 p = ivec2(0.0);
    p.x = int( uv.x*18.);
    p.y = int( uv.y*28.);
    float lr = 0.0;
    if( p.x > 8 )
    {
        p.x = p.x - 9;
        lr = 1.0;
    }

    float r0=0.0;
    float r1=0.0;

    if(p.y== 0) { r0=MKNum( GG,GG,GG,GG,GG,GG,BB,BB,BB); r1=MKNum( BB,BB,GG,GG,GG,GG,GG,GG,GG); }
    if(p.y== 1) { r0=MKNum( GG,GG,GG,GG,BB,BB,RR,RR,RR); r1=MKNum( RR,RR,BB,BB,BB,GG,GG,GG,GG); }
    if(p.y== 2) { r0=MKNum( GG,GG,GG,BB,RR,RR,RR,RR,RR); r1=MKNum( BB,BB,WW,WW,WW,BB,GG,GG,GG); }
    if(p.y== 3) { r0=MKNum( GG,BB,BB,RR,RR,RR,RR,BB,BB); r1=MKNum( WW,WW,WW,WW,WW,BB,GG,GG,GG); }
    if(p.y== 4) { r0=MKNum( GG,BB,RR,RR,RR,BB,BB,WW,WW); r1=MKNum( WW,WW,BB,BB,BB,BB,GG,GG,GG); }
    if(p.y== 5) { r0=MKNum( GG,BB,RR,BB,BB,BB,WW,WW,WW); r1=MKNum( BB,BB,BB,BB,BB,BB,BB,GG,GG); }
    if(p.y== 6) { r0=MKNum( GG,BB,BB,GG,GG,BB,WW,WW,BB); r1=MKNum( BB,PP,PP,PP,PP,BB,GG,GG,GG); }
    if(p.y== 7) { r0=MKNum( BB,WW,WW,BB,BB,BB,BB,BB,BB); r1=MKNum( PP,PP,PP,BB,PP,BB,GG,GG,GG); }
    if(p.y== 8) { r0=MKNum( BB,WW,WW,BB,BB,PP,PP,BB,BB); r1=MKNum( PP,PP,PP,BB,PP,BB,BB,BB,GG); }
    if(p.y== 9) { r0=MKNum( GG,BB,BB,GG,BB,PP,PP,BB,BB); r1=MKNum( BB,PP,PP,PP,PP,PP,PP,PP,BB); }
    if(p.y==10) { r0=MKNum( GG,GG,GG,GG,BB,PP,PP,PP,BB); r1=MKNum( PP,PP,BB,PP,PP,PP,PP,PP,BB); }
    if(p.y==11) { r0=MKNum( GG,GG,GG,GG,GG,BB,PP,PP,PP); r1=MKNum( PP,BB,BB,BB,PP,PP,PP,BB,GG); }
    if(p.y==12) { r0=MKNum( GG,GG,GG,BB,BB,BB,BB,BB,BB); r1=MKNum( BB,BB,BB,BB,BB,BB,BB,GG,GG); }
    if(p.y==13) { r0=MKNum( GG,GG,BB,BB,BB,WW,WW,WW,WW); r1=MKNum( WW,WW,WW,WW,WW,WW,BB,BB,GG); }
    if(p.y==14) { r0=MKNum( GG,GG,BB,BB,WW,WW,WW,WW,WW); r1=MKNum( WW,WW,WW,WW,WW,WW,WW,BB,GG); }
    if(p.y==15) { r0=MKNum( GG,GG,BB,BB,WW,WW,WW,WW,WW); r1=MKNum( WW,WW,WW,WW,WW,WW,WW,BB,GG); }
    if(p.y==16) { r0=MKNum( GG,GG,BB,BB,BB,WW,WW,WW,WW); r1=MKNum( WW,WW,WW,WW,WW,WW,WW,BB,GG); }
    if(p.y==17) { r0=MKNum( GG,GG,BB,WW,WW,BB,BB,BB,BB); r1=MKNum( BB,BB,BB,BB,BB,BB,BB,BB,GG); }
    if(p.y==18) { r0=MKNum( GG,GG,BB,WW,WW,BB,RR,RR,RR); r1=MKNum( RR,RR,RR,RR,RR,RR,BB,GG,GG); }
    if(p.y==19) { r0=MKNum( GG,GG,BB,WW,BB,RR,RR,RR,RR); r1=MKNum( RR,RR,RR,RR,RR,RR,BB,GG,GG); }
    if(p.y==20) { r0=MKNum( GG,GG,BB,WW,WW,WW,BB,RR,RR); r1=MKNum( RR,RR,RR,BB,BB,BB,BB,BB,GG); }
    if(p.y==21) { r0=MKNum( GG,GG,BB,WW,BB,BB,RR,RR,RR); r1=MKNum( RR,RR,BB,RR,RR,RR,RR,BB,BB); }
    if(p.y==22) { r0=MKNum( GG,GG,BB,WW,WW,BB,RR,RR,RR); r1=MKNum( RR,RR,RR,RR,RR,RR,RR,RR,BB); }
    if(p.y==23) { r0=MKNum( GG,GG,BB,WW,WW,BB,RR,RR,RR); r1=MKNum( RR,RR,RR,RR,RR,RR,RR,RR,BB); }
    if(p.y==24) { r0=MKNum( GG,GG,BB,BB,BB,RR,RR,RR,RR); r1=MKNum( RR,RR,RR,RR,RR,RR,RR,RR,BB); }
    if(p.y==25) { r0=MKNum( GG,GG,BB,BB,RR,RR,RR,RR,RR); r1=MKNum( RR,RR,RR,RR,RR,RR,RR,RR,BB); }
    if(p.y==26) { r0=MKNum( GG,GG,BB,BB,BB,RR,RR,RR,RR); r1=MKNum( RR,RR,RR,RR,RR,RR,RR,BB,BB); }
    if(p.y==27) { r0=MKNum( GG,GG,GG,BB,BB,BB,BB,BB,BB); r1=MKNum( BB,BB,BB,BB,BB,BB,BB,BB,GG); }

    float rr = mix( r0, r1, lr );
    
    int lookup = int(mod( floor(rr / pow(5.0,float(p.x))), 5.0 ));
    
    // black
    if( lookup==0 )
        return vec3(0.0,0.0,0.0);
        
    // http://www.colourlovers.com/color/F3DFDF/Marios_Skin
    if( lookup==1 )
        return vec3(1.000, 0.203, 0.094);
        
    // skin
    if( lookup==2 )
        return vec3(1.000, 0.564, 0.360);
        
    // white
    if( lookup==3 )
        return vec3(1.0,1.0,1.0);
        
    // green background
    if( lookup==4 )
        return original;
}

float snoise(vec3 v);

void main(void)
{
    vec3 col = vec3( 0.0, 0.5, 0.0 );
    
    {
        vec2 res = vec2(resolution.x/resolution.y,1.0);
        vec2 p = ( gl_FragCoord.xy / resolution.y ) - (res/2.0);
    
        float n = 0.0;
        
        for( int i=0; i<3; ++i )
        {
            float f = float(i) - 1.0;
            float n0 = snoise( vec3( ( p.x + time * f * 0.05 )* 50.0, ( p.y + f*341.0 + time * 0.1 ) * 50.0, time * 0.01 ) );
            n += max( ( n0 - 0.88 ) / 0.03, 0.0 );
        }
            
        for( int i=0; i<3; ++i )
        {
            float f = float(i) - 2.0;
            float n0 = snoise( vec3( ( p.x + sin( time * f ) * 0.05 )* 50.0, ( p.y + f*341.0 + time * 0.1 ) * 50.0, time * 0.01 ) );
            n += max( ( n0 - 0.88 ) / 0.03, 0.0 );
        }
        
        col = mix( col, vec3( 1.0, 1.0, 1.0 ), n );
    }


    // pixel art is 18x28 so made some adjustments to get aspect ratio correct
    float hx = resolution.x * 0.5;
    float hy = resolution.y * 0.5;
    float offset = resolution.x * 0.64 * 0.4;
    
    if( abs(gl_FragCoord.x/0.64-offset-hx)<hy )
    {
        float rx = (gl_FragCoord.x/0.64-(hx+offset-hy))/resolution.y;
        float ry = 1.0 - gl_FragCoord.y/resolution.y;
        col = sample( vec2(rx,ry), col );
    }

    gl_FragColor = vec4(col, 1.0);
}




//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }
