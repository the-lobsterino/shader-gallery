/*
 * Original shader from: https://www.shadertoy.com/view/MtsGRl
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

// Emulate a texture
#define texture(s, uv) vec4(0.)

// --------[ Original ShaderToy begins here ]---------- //
#define time iTime
#define EPSILON .001
const float PI=3.14159265;
const int MAX_ITER = 250;
vec3 lightDir=normalize(vec3(14., -1.6, -9.)); 
vec2 of=vec2(0.); //= texture( iChannel2, vec2( 0., 0.15 ) ).xy*vec2(1,-0.8) +  vec2(0.5,1.5);
struct mat
{
  float typeMat;        
     
};
mat materialMy = mat(0.0);

//-----------------------------
vec3 getNormal(in vec3 p);
float renderFunction(in vec3 pos);
float render(in vec3 posOnRay, in vec3 rayDir);
vec4 getColorPixel(inout vec3 ro, vec3 rd, inout vec3 normal, float dist, float typeColor);
//-----------------------------
//---------------------------------------------
vec3 rotationCoord(vec3 n)
{
 vec3 result;

   float t = time;
   vec2 sc = vec2(sin(t), cos(t));
   mat3 rotate;

      rotate = mat3( sc.y,  0.0, -sc.x,
                     0.0,   1.0,  0.0,
                     sc.x,  0.0, sc.y);   

  result = n * rotate;
  return result;
}
//------------------------------------------
vec2 rot(vec2 p,float r)
{
  vec2 ret;
  ret.x=p.x*cos(r)-p.y*sin(r);
  ret.y=p.x*sin(r)+p.y*cos(r);
  return ret;
}
//------------------------------------------
vec2 rotsim(vec2 p,float s)
{
  vec2 ret=p;
  ret=rot(p,-PI/(s*2.0));
  ret=rot(p,floor(atan(ret.x,ret.y)/PI*s)*(PI/s));
  return ret;
}
//----------------------------------------------------
//----------------------------------------------------
//ÐŸÑ€Ð¸Ð¼Ð¸Ñ‚Ð¸Ð²Ñ‹
//----------------------------------------------------
float trunCapsuleY(vec3 p, float r, float h)
{
    p.y -= clamp(p.y, 0.0, h * 2. );
    return max(length(p) - r ,  abs(p.z)- h / 2.);
}
//--------------------------------------------------
float sdHeart(in vec3 pos, in float r, in float d) 
{
    pos = -pos; 
    pos.x = abs(pos.x);
    pos.xy = sqrt(3.5)* 0.15 *mat2(1.,-1.,1.,1.)*pos.xy;
    float hr = trunCapsuleY(pos-vec3(r, 0, 0), r, d);
    return hr;
}
//----------------------------------------------------
float dSphere(vec3 p, float r)
{
   return length(p) - r;
}
//----------------------------------------------------
float sdTriPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    float basic = 0.61;
    return max(q.z-h.y,max(q.x* basic +p.y*0.5,-p.y)-h.x*0.5);
}
//-------------------------
float pTorus(vec3 p, vec2 t)
{
  vec2 q = vec2(length(p.xy)-t.x,p.z);
  return length(q)-t.y;
}
//----------------------------------------------------
float zCylinder(vec3 p, vec2 h) 
{
    return max( length(p.xz)-h.x, abs(p.y)-h.y );
}

//----------------------------------------------------
float yCylinder(vec3 p, vec2 h) 
{
    return max( length(p.xy)-h.x, abs(p.z)-h.y );
}
//----------------------------------------------------
//--------------------------------------------------
float smin( float a, float b, float k ) 
{
   float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
   return mix( b, a, h ) - k*h*(1.0-h);
}
//------------------------------------------
float plush(in vec3 p) 
{
   p=abs(fract(p ));
    for (int i=0; i< 9; i++) 
   {
      p=abs(p)/dot(p,p)-0.5;
   }
   float l=min(3.,length(p));
   return pow(l , 1.1);
}

//---------------------------------------------
float distMat(inout float curDist, float dist, in float typeMat)
{
   float res = curDist;
   if (dist < curDist) 
   {
      materialMy.typeMat     = typeMat;
      res                    = dist;
     return res;
   }
   return curDist;
}
//--------------------------------------------------ÐœÐµÐ´Ð²ÐµÐ´ÑŒ
float bear(in vec3 pos )
{
  float d = 1.;
   d = dSphere(pos, 6.);
   pos.y +=15.;
   d = smin(d, dSphere(pos * vec3(0.8, 0.5, 0.8), 6.), 0.8); 
   d = smin(d, dSphere(pos * vec3(1.03, 1.08, -0.64) + vec3(0., -15.58, 1.52), 3.8), 0.1);
   vec3 p1 = pos;
   p1.x = abs(p1.x);   
   // Ð£ÑˆÐ¸
   d = smin(d, dSphere(p1 * vec3(1.14, 0.94, 1.68) + vec3(-5, -18., 0.), 3.), 0.3);   
   d = max(d, -dSphere(p1  + vec3(-4.6, -19.6, -1.), 1.5));    
   //ÐÐ¾Ð³Ð¸
   d = smin(d, dSphere(p1 * vec3(1.75, 1.72, -0.7 ) + vec3(-8., 15., 4.), 6.), 1.8); 
   d = smin(d, dSphere(p1 * vec3(1.46, 0.78, 1.28) + vec3(-6., 5.25, -18.6), 4.), 0.3);    
   //Ð›Ð°Ð¿Ñ‹
   d = smin(d, dSphere(p1 * vec3(2.39, 1.72, -0.96 ) + vec3(-14.6, -10.8, 4.5), 6.), 1.8); 
  // Ð›ÐµÐ²Ð°Ñ
   d = smin(d, dSphere(pos  * vec3(1., 1.16, 1. ) + vec3(3.18, -6., -10.3), 3.), 1.8);    
  // ÐŸÑ€Ð°Ð²Ð°Ñ
   d = smin(d, dSphere(pos  * vec3(1.2, 0.88, 1.1) + vec3(-7., -8., -12.), 3.), 1.8);
  return d;
  
}
//--------------------------------------------------Ð’ÐµÑ€Ñ‚ÑƒÑˆÐºÐ°
float whirligig(in vec3 p )
{
 p.zy = rot(p.zy,(time )* 5.);
 p.yz=rotsim(p.yz,3.0);
 return sdTriPrism( p, vec2(1.5, 5.) );;
}
//--------------------------------------------------Ð ÑƒÑ‡ÐºÐ°
float grip(in vec3 p )
{
 float grip = zCylinder(p  ,vec2(0.4, 11.)) ;
 p += vec3(0.2, 10.6, -2.5);
 p.xz = rot(p.xz, 1.5);
 return min(grip, max(pTorus(p  , vec2(2.5, 0.4)), p.y + 0.25));
}
//--------------------------------------------------
float myObject(in vec3 p)
{
   materialMy.typeMat = 0.0;
   vec3 pos = p;
   pos += vec3(0., -10., 12.);
   pos = rotationCoord(pos);     
   float d = 1.0;
   d =  distMat(d, zCylinder(pos + vec3(0., 26.7, 0.),vec2(30., 0.3)), 6.) ;   
  
   vec3 p1 = pos;
   p1.x = abs(p1.x);
   p1 += vec3(-3.12, -1.62, -4.54);   
   float eyes = dSphere(p1, 1.);
   d =  distMat(d,   eyes ,  3.0); 
   d =  distMat(d,   dSphere(pos * vec3(0.78, 1.18, 1.) + vec3(0., -0.36, -7.5), 1.55) ,  3.0);    

   float det =  pTorus(pos * vec3(0.88, 1.41, 0.68) + vec3(0., 2.4, -4.2), vec2(2., 0.26)); 
   p1 = pos;
   p1 += vec3(0., 1.14, -6.37);
   p1.xz = rot(p1.xz, 1.5);
   det = min(det, pTorus(p1 * vec3(1.08, 1.06, 0.6) ,  vec2(2., 0.26)));
   d =  distMat(d,  det , 2.);
  // ÐœÐ¸ÑˆÐºÐ°
  float toy = bear(pos );
   toy *=  plush(pos);
   d =  distMat(d,   toy ,  1.0);     
   vec3 pos1 = pos;
  // Ð¡ÐµÑ€Ð´Ñ†Ðµ 
//    float of = texture( iChannel2, vec2( .01, .25 ) ).x;
   p1 = pos;
   p1.xy *=  of;//p1.xy * sin(of)  ;
   p1 += vec3(0., 6., -9) ;
   
   float hr = sdHeart(p1, 1., 1.8);
   d =  distMat(d,    hr ,  5.0);   
// Ð ÑƒÑ‡ÐºÐ° 
 float g = grip(pos + vec3(-6., 0., -13.));

 d = distMat(d, g, 2.); 
 // Ð’ÐµÑ€Ñ‚ÑƒÑˆÐºÐ°
 float w = whirligig(pos + vec3(-7.5, -10.6, -12.8));
 d = distMat(d, w, 4.); 

return d; 
}
//-------------------------------------------------
// Ð²Ñ‹Ð²Ð¾Ð´ Ð¾Ð±ÑŠÐµÐºÑ‚Ð°
float renderFunction(in vec3 pos)
{
    return  myObject(pos);    
}
//------------------------------------------------- 
vec3 getNormal(in vec3 p)
{

   vec3 e = vec3( 0.1, 0., 0. );
   vec3 nor = vec3(
       renderFunction(p+e.xyy) - renderFunction(p-e.xyy),
       renderFunction(p+e.yxy) - renderFunction(p-e.yxy),
       renderFunction(p+e.yyx)- renderFunction(p-e.yyx));
   return normalize(nor);  

}
//------------------------------------------
vec3 getlighting(in vec3 ro, in vec3 rd ,in vec3 norm, in vec3 lightDir, in vec4 color)
{
     vec3 ref = reflect( rd, norm );
     vec3 col = vec3(0.0);
     col += mix( vec3(0.05,0.02,0.0), 1.2*vec3(0.8,0.9,1.0), 0.5 + 0.5*norm.y );
     col *= 1.0 + 1.5*vec3(0.7,0.5,0.3)*pow( clamp( 1.0 + dot(norm,rd), 0.0, 1.0 ), 2.0 );
     col += 27. *clamp(0.3 + 2. * norm.y, 0.0,1.0)* pow(texture( iChannel0, ref ).xyz,vec3(2.2));//*(rim);
     col *= color.w;
     col *= color.rgb;
 
  //  vec2 q = fragCoord.xy / iResolution.xy;// gl_TexCoord[0].xy;      
  //  col *= -0.16 + 0.68 * pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.15 );  
    return col ;    

}
//----------------------------------------------------------------------
vec4 getColorPixel(inout vec3 ro, vec3 rd, inout vec3 normal, float dist, float typeColor)
{

  vec4 color = vec4(1.);
  vec3 hitPos = ro + rd * dist;
  normal = normalize(getNormal(hitPos));  
  float diffuse = max(0.0, dot(normal, -lightDir)) * 0.5 + 0.5;
 
  float specular = 0.0;   
      if (dot(normal, -lightDir) < 0.0) 
         specular = 0.0;
     else 
         specular = pow(max(0.0, dot(reflect(-lightDir, normal), normalize(ro - hitPos))), 5.0);

//----------------------------------
   if (materialMy.typeMat == 0.0) 
  {
     color =  texture(iChannel0, rd);
     diffuse = 1.0;
   } 
   else if (materialMy.typeMat == 1.0) 
     color = vec4(1.);
   else if (materialMy.typeMat == 2.0) 
     color = vec4(0.37, 0.16, 0.16, 1.);
   else if (materialMy.typeMat == 3.0) 
     color = vec4(0.35, 0.33, 0.36, 1.);
   else if (materialMy.typeMat == 4.0) 
     color = vec4(0.9, 0.25, 1., 1.);  
   else if (materialMy.typeMat == 5.0)
    color = vec4(0.85, 0., 0.05, 1.);  
   else if (materialMy.typeMat == 6.0)    
   {
       vec3 pos = rotationCoord(hitPos);     
        color.rgb = texture( iChannel1, 0.05 *  pos.xz ).xyz;
   }    
   float mat =  materialMy.typeMat;
   if(mat != 0.0)
  {
     if( mat > 2.5 && mat < 5.5)
      color.rgb =  getlighting(hitPos, rd ,normal, lightDir, color);
     else
        color.rgb *= diffuse + specular;   
  }
  ro = hitPos;
  return color ;
}

//-------------------------------------------------
float render(in vec3 posOnRay, in vec3 rayDir)
{ 
  float t = 0.0;
  float maxDist = 76.;
  for(int i=0; i<MAX_ITER; ++i)
  {
    float d = renderFunction(posOnRay + t*rayDir); 
    if (abs(d) < 0.01 || t > maxDist) 
         break;
    t += d;
  }
   return t;
}
//------------------------------------------
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 pos     =  fragCoord.xy / iResolution.xy * 2. - 1.;
    pos.x *= iResolution.x / iResolution.y;    
    of = texture( iChannel2, vec2( 0., 0.15 ) ).xy*vec2(1,-0.8) +  vec2(0.5,1.5);
    
    float t = time* 0.1;
    vec3 camP = vec3(0., 4., 30.);
    vec3 camUp = vec3(0. , 1., 0.);
    vec3 camDir = normalize(-camP);
    vec3 u = normalize(cross(camUp,camDir));
    vec3 v = cross(camDir,u);
    vec3 rayDir = normalize(2. * camDir + pos.x * u + pos.y * v);  
  vec4 color    = vec4(1.0);
  vec3 normal   = vec3(1.0);

//------------------------------
   
  vec3 posOnRay = camP; 
  float path = 0.;
  //--------------------------- 
     path =  render(posOnRay, rayDir);  
     color = getColorPixel(posOnRay, rayDir, normal, path, materialMy.typeMat); 
     fragColor =  color;

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}