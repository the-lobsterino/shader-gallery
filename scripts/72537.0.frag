/*
 * Original shader from: https://www.shadertoy.com/view/fsSGWc
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
//////////////////////////////////
//https://www.shadertoy.com/view/lldBRn

float noise1d(float n){
    return fract(cos(n*89.42)*343.42);
}

//////////////////////////////////
const float EPSILON = .01;
const float MAX_DISTANCE = 1000.0;

struct RayData
{
    float d;
    int objId;
};

float remap(float a, float b, float c, float d, float t) {
	return (t-a)/(b-a) * (d-c) + c;
}

const vec3 LIGHT_DIR = normalize( vec3( .2, .3, -.25 ) );
const float HEAD_SIZE = 2.15;

//////////////////////////////////

//https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdRoundedCylinder( vec3 p, float ra, float rb, float h )
{
  vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

float sdCappedCylinder(vec3 p, vec3 a, vec3 b, float r)
{
  vec3  ba = b - a;
  vec3  pa = p - a;
  float baba = dot(ba,ba);
  float paba = dot(pa,ba);
  float x = length(pa*baba-ba*paba) - r*baba;
  float y = abs(paba-baba*0.5)-baba*0.5;
  float x2 = x*x;
  float y2 = y*y*baba;
  float d = (max(x,y)<0.0)?-min(x2,y2):(((x>0.0)?x2:0.0)+((y>0.0)?y2:0.0));
  return sign(d)*sqrt(abs(d))/baba;
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
  vec3 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdCappedTorus(in vec3 p, in vec2 sc, in float ra, in float rb)
{
  p.x = abs(p.x);
  float k = (sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy);
  return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}

float opSmoothUnion( float d1, float d2, float k )
{
  float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
  return mix( d2, d1, h ) - k*h*(1.0-h);
}

////////////////////////////////////

/*mat4 GetMatrix( vec3 pos, vec3 dir )
{
    dir = normalize(dir);
    vec3 right = normalize( cross( vec3( 0.0, 1.0, 0.0 ), dir ) );
    vec3 up = normalize( cross( dir, right ) );
    return mat4
    (
         vec4( right, 0.0),
         vec4( up, 0.0),
         vec4( dir, 0.0 ),
         vec4( pos ,1.0)
    );
}*/

mat3 GetMatrix( vec3 dir )
{
    dir = normalize(dir);
    vec3 right = normalize( cross( vec3( 0.0, 1.0, 0.0 ), dir ) );
    vec3 up = normalize( cross( dir, right ) );
    return mat3
    (
         right,
         up,
         dir
    );
}

void GetRay( in vec2 fragCoord, out vec3 pos, out vec3 dir )
{
    float distance = -6.5;

    float offset = 0.0;
    pos = vec3( sin(offset) * 8.0 , 1.0, cos(offset) * -8.0);

    float n = .3/max(iResolution.x, iResolution.y);
    
    vec3 camFwd = normalize( -pos );
    vec3 camRight = cross( vec3( 0, 1, 0), camFwd );

    mat3 cameraOrientation = mat3( 
     camRight.x, camRight.y, camRight.z ,
     0, 1, 0 ,
     camFwd.x, camFwd.y, camFwd.z );
     
    dir = normalize(vec3((fragCoord - iResolution.xy*0.5)*n, 0.5));;//cameraOrientation * normalize(vec3((fragCoord - iResolution.xy*0.5)*n, 0.5));
}

vec3 RayToPlane( vec3 pn, vec3 pp, vec3 rd, vec3 rp )
{
    float denom = dot( pn, rd );
    
    float t = dot( pp - rp, pn );
    
    return rp + rd * t;
}

vec3 Background( vec3 dir )
{
    float sun = max( 0.0, dot( dir, LIGHT_DIR));
    sun = smoothstep( 0.199, 1.0, sun);
    sun = pow(sun, 20.0);
    
    
    float horizon = max( 0.0, dot( dir, vec3(0.0, 1.0, 0.0 )));
    horizon = smoothstep( -.45, .09, horizon);
 
    
    return vec3( horizon + sun);
}

vec3 HeadColor( vec3 p, vec3 rayPos, vec3 rayDir, out vec3 normal )
{
    vec3 c = vec3(1);
    {
        //main head color
        vec3 center = normalize(vec3( 0.0, -.37, -.8) ) * HEAD_SIZE;
        vec3 dt = center - p;
        
        const float edge = HEAD_SIZE * .9;
        float diff = clamp( (length(dt) - edge ) * 10.0 * 4.0, -1.0, 1.0) ;
        //https://blog.pablolarah.cl/2012/08/color-palette-3-doraemon.html

        c = mix( vec3(1.0), vec3( 25.0 / 255.0, 171.0 / 255.0, 255.0 / 255.0), step(0.0, diff )  );

        c = mix( vec3(0.8) * c, c, abs(diff) );
        
    }
    
    {
        //eyes
        float diff = HEAD_SIZE;
        
        const float edge = HEAD_SIZE * .185;
        
        
        for( int i = -1; i <= 1; i +=2)
        {
            vec3 eyePos = normalize(vec3( float( i ) * .17, 0.42, -.8) ) * HEAD_SIZE;
            vec3 dt = eyePos - p;
            
            float d = clamp( ( (dt.x * dt.x + dt.y * dt.y * (.8 - float(i) * (dt.x / edge) * .063)) - edge * edge ) * 9.0 , -1.0, 1.0 );
            
            diff = min( diff, d);
           
        }
        diff = clamp(diff / HEAD_SIZE, -1.0 , 1.0) * 62.0;

        c = mix( vec3(1.0), c, step( 0.0, diff));
        
        
        

        c = mix( c, vec3(0.8) * c, exp(1.0 - abs(diff)) );
        
        const vec3 faceDirection = normalize(vec3(0.0,0.0, 1.0));
        vec3 targetDir;
        vec3 targetPos;
        GetRay(iMouse.xy, targetPos, targetDir);
        
        float blink = step( .045 , fract( iTime * .5 ) );
        
        for( int i = -1; i <= 1 ; i +=2)
        {
            //pupils
            
            vec3 eyePos = normalize(vec3( float( i ) * .16, 0.4, -.8) ) * HEAD_SIZE;
            
            vec3 lookPos = RayToPlane(faceDirection, eyePos, targetDir, targetPos );
            vec3 lookOffset = (lookPos - eyePos);
            float eyeOffX= float(i) * .015;

            float lookAngle = atan( lookOffset.y * 2.0, lookOffset.x );

            float offsetx = clamp( lookOffset.x, -.23 + eyeOffX , .23 - eyeOffX  );
            float offsety = clamp( lookOffset.y, -.28, .3);
            
            eyePos.x+= offsetx * ( 1.0 - abs( sin( lookAngle ) ) );
            eyePos.y+= offsety;

            vec3 eyePosProjected = RayToPlane(faceDirection, eyePos, rayDir, rayPos);

            float pupil = edge * (.32 + (1.0 - blink) * .13);     
            
            vec3 eyeDt = eyePos - eyePosProjected;
            float eyeDist = length( eyeDt);
            float eyeMain = clamp( (pupil - eyeDist) * 100.0, 0.0, 1.0) ;

            vec2 eyePosDelta = (eyePos.xy - eyePosProjected.xy);
            float blinkMultiplier = step( abs( eyePosDelta.y), eyeMain * (0.025 + blink ) );
            c = mix( c, vec3(0.0), step( length( eyePosDelta), eyeMain * blinkMultiplier ));

            float fallOff = (1.0 - clamp( eyeDt.y + 0.78, 0.0 , 1.0)) * 3.0;
            
            
            float pupilInnerA = pupil * .78;
            float eyeInnerA = (abs( pupilInnerA - eyeDist ) / pupilInnerA - .13 ) * 10.5;

            float pupilInnerB = pupil * .50;
            float eyeInnerB = (abs( pupilInnerB - eyeDist ) / pupilInnerB - .18 ) * 1.0;
            
            c = mix( mix( vec3(209.0 / 255.0, 135.0 / 255.0 , 65.0 / 255.0), c, blinkMultiplier * fallOff) , c, clamp( 99.0 * (1.0 - blinkMultiplier ) + min( eyeInnerA, eyeInnerB ), 0.0, 1.0) );
            
            //eye glow
            float glowAngle = iTime + sin(noise1d(iTime))* .01;
            vec2 glowOff = vec2( sin(glowAngle*20.0) , cos(glowAngle * 15.0)) * .0015;
            
            float glowA = pupil * .1;
            vec3 eyeGlowAPosProjected = RayToPlane(faceDirection, eyePos, rayDir, eyePos - vec3( 0.035, -0.035, 0.0) );
            float glowDistA = length(eyeGlowAPosProjected.xy + glowOff - eyePosProjected.xy);
            c = mix( c, vec3(1.0), step(glowDistA, .025 * blink));
            
        }
    }
    
    {
        //details
        const float start = .21;
        const float end =  -.07;
        const float width =  .006;
        
        vec3 coordP = normalize(p);
        
        float diffX = clamp( 1.0 - abs( coordP.x )/width, 0.0, 1.0);
        
        float diffY = step( coordP.y, start) * step( end ,coordP.y);
        
        c = mix( c, vec3(.8), diffX * diffY );
    }
    
    return c;
}

vec3 NoseColor( vec3 n, vec3 dir )
{
    return vec3( dot( Background( reflect( dir, n )), vec3( 1.0, 0.0, 0.0 ) ), 0.0, 0.0);
}

RayData GetScene( vec3 p )
{
    float d = MAX_DISTANCE;
    
    {// main body
    
       {
          //center
          float s = sdSphere( p, HEAD_SIZE );
          d = min(d, s);
          
          if( d < EPSILON )
          {
              return RayData(d, 0 );
          }
       }
       
       {
          //nose
          float s = sdSphere( p + normalize(vec3(0.0, -.265, 1.0)) * HEAD_SIZE, HEAD_SIZE * .1 );
          d = min(d , s);
          
          if( d < EPSILON )
          {
              return RayData(d, 1 );
          }
       }
       
       {
           //whiskers
           
           for( int x = -1; x <= 1; x+= 2)
           {
               for( int y = 0; y < 3; y++ )
               {
                   vec3 pos = normalize(vec3(0.25 * float(x), .16 - float(y) * .1, -1.02)) * HEAD_SIZE;
                   float c = sdCapsule( p, pos, pos + normalize(vec3( 0.7 * float(x), 0.3  - float(y) * .3, -.1)) * 0.9, .001 ); 
                   d = min(d , c);

                   if( d < EPSILON )
                   {
                      return RayData(d, 2 );
                   }
               }
           }
           
       }
       
       
    }
    
    return RayData( d, -1);
}

vec3 GetNormal( vec3 p , vec3 dir )
{
                            
    float d0 = GetScene( p ).d;
    vec2 off = vec2( EPSILON, 0.0 );
    vec3 d1 = vec3( GetScene( p - off.xyy ).d, GetScene( p - off.yxy ).d, GetScene( p - off.yyx ).d);
    
    return normalize( d0 - d1);
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    
    vec3 pos, dir;
    GetRay( fragCoord, pos, dir );
    
    
    vec2 uv = (fragCoord.xy) / iResolution.xy;
    
    float distance = 0.0;
    vec3 color = Background( dir );
    for( int i = 0; i < 256; i++)
    {
        vec3 p = pos + dir * distance;
        vec3 c = vec3(0);
        RayData rd = GetScene( p );

        
        if( rd.d < EPSILON )
        {
            vec3 n = GetNormal( p , dir );

            if(rd.objId == 0 )
            {
                color = HeadColor(p, pos, dir, n );
            }
            else if( rd.objId == 1 )
            {
                color = NoseColor( n , dir );
            }
            else if( rd.objId == 2 )
            {
                color = vec3(0);
            }
            else if( rd.objId == 3 )
            {
                color = vec3(0.8);
            }

            
            float amb = (.4 + .3 * n.y );

            color *= max( amb, dot( n, LIGHT_DIR ) );
            
            break;
        }
        else if( distance > MAX_DISTANCE )
        {
            break;
        }

        distance += rd.d;
    }
    
    fragColor = vec4( color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}