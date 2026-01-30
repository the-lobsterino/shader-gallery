#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;//x:观察角度 y:缩放   6，  600
uniform float time;

//几何物体的绘制方法---------------------------------------------------------
float sdPlane( vec3 p )
{
  return p.y;
}

float udRoundBox( vec3 p, vec3 b, float r )//圆角正方体参数
{
  return length(max(abs(p)-b, 0.0))-r;
}

float sdBlob (in vec3 pos, in float r)
{
  vec3 v1 = pos * 6.0;
  return 0.05*(r + 0.5* (length(dot(v1, v1)) -0.51*(cos(4.*v1.x) +cos(4.*v1.y) +cos(4.*v1.z))));
}

float length2( vec2 p )
{
  return sqrt( p.x*p.x + p.y*p.y );
}

float length6( vec2 p )
{
  p = p*p*p; 
  p = p*p;
  return pow( p.x + p.y, 1.0/6.0 );
}

float length8( vec2 p )
{
  p = p*p; 
  p = p*p; 
  p = p*p;
  return pow( p.x + p.y, 1.0/8.0 );
}

//----------------------------------------------------------------------

// Union: d1 +d2
vec2 opU( vec2 d1, vec2 d2 )//比较x较小的
{
  return (d1.x < d2.x) ? d1 : d2;
}


//绘制各个物体----------------------------------------------------------------------
vec2 map( in vec3 pos )
{
  vec3 sp = pos - vec3( 0.0, 0.25, 0.0);
  vec2 res = opU( vec2( sdPlane(pos), 1.0 ), 
		  vec2( sdBlob( sp, -0.5 - 0.45*sin(1.0) ), 246.9 ) );
  
  //绘制圆角正方体
  res = opU( res, 
	     vec2( udRoundBox( pos-vec3( 1.0, 0.25, 1.0), 
				vec3(0.12), 0.1 ), 
	     			41.0 ) 
	   );

  return res;
}

vec3 castRay( in vec3 ro, in vec3 rd )
{
  float tmin = 1.0;
  float tmax = 20.0;
	
  float fog = 0.;

  #if 0
    float tp1 = (0.0-ro.y)/rd.y; 
  if ( tp1>0.0 ) tmax = min( tmax, tp1 );
  float tp2 = (1.6-ro.y)/rd.y; 
  if ( tp2>0.0 ) { 
    if ( ro.y>1.6 ) tmin = max( tmin, tp2 );
    else           tmax = min( tmax, tp2 );
  }
  #endif

  float precis = 0.002;
  float t = tmin;
  float m = -1.0;
  for ( int i=0; i<50; i++ )
  {
    vec2 res = map( ro+rd*t );
    fog += res.y * 0.000005;
    if ( res.x<precis || t>tmax ) break;
    t += res.x;
    m = res.y;
  }

  if ( t>tmax ) m=-1.0;
  return vec3( t, m, sin(time)*fog );
}

//软阴影
float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
  float res = 3.0;
  float t = mint;
  for ( int i=0; i<16; i++ )
  {
    float h = map( ro + rd*t ).x;
    res = min( res, 8.0*h/t );
    t += clamp( h, 0.02, 0.10 );
    if ( h<0.001 || t>tmax ) break;
  }
  return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal( in vec3 pos )
{
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
  for ( int i=0; i<5; i++ )
  {
    float hr = 0.01 + 0.12*float(i)/4.0;
    vec3 aopos =  nor * hr + pos;
    float dd = map( aopos ).x;
    occ += -(dd-hr)*sca;
    sca *= 0.95;
  }
  return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );
}

//渲染函数---------------------------------------------------------
vec3 render( in vec3 ro, in vec3 rd )
{ 
  vec3 col = vec3(0.8, 0.9, 1.0);
  vec3 rayc = castRay(ro, rd);
  vec2 res = rayc.xy;
	
  float t = res.x;
  float m = res.y;
  if ( m>-0.5 )
  {
    vec3 pos = ro + t*rd;
    vec3 nor = calcNormal( pos );
    vec3 ref = reflect( rd, nor );

    // 材质     
    col = 0.45 + 0.3*sin( vec3(0.05, 0.08, 0.10)*(m-1.0) );

    if ( m<1.5 )
    {
      float f = mod( floor(5.0*pos.z) + floor(5.0*pos.x), 2.0);
      col = 0.4 + 0.1*f*vec3(1.0);
    }

    // 光照       
    float occ = calcAO( pos, nor );
    vec3  lig = normalize( vec3(-0.6, 0.7, -0.5) );//正规化的 光线方向
    float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
    float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
    float bac = clamp( dot( nor, normalize(vec3(-lig.x, 0.0, -lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y, 0.0, 1.0);
    float dom = smoothstep( -0.1, 0.1, ref.y );
    float fre = pow( clamp(1.0+dot(nor, rd), 0.0, 1.0), 2.0 );
    float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ), 16.0);

    dif *= softshadow( pos, lig, 0.02, 2.5 );//调用绘制软阴影	//一个方向的主阴影
    dom *= softshadow( pos, ref, 0.02, 2.5 );//另一个方向的次阴影

    //各类颜色系数叠加
    vec3 brdf = vec3(0.0);
    brdf += 1.20*dif*vec3(1.00, 0.90, 0.60);
    brdf += 1.20*spe*vec3(1.00, 0.90, 0.60)*dif;
    brdf += 0.30*amb*vec3(0.50, 0.70, 1.00)*occ;
    brdf += 0.40*dom*vec3(0.50, 0.70, 1.00)*occ;
    brdf += 0.30*bac*vec3(0.25, 0.25, 0.25)*occ;
    brdf += 0.40*fre*vec3(1.00, 1.00, 1.00)*occ;
    brdf += 0.02;
    col = col*brdf;
    col = mix( col, vec3(0.8, 0.9, 1.0), 1.0-exp( -0.0005*t*t ) );
  }
  return vec3( clamp(col - rayc.z*40., 0.0, 1.0) );
}

//主函数---------------------------------------------------------
void main( void )
{
  vec2 p = 2.0*(gl_FragCoord.xy / resolution.xy) - 1.0;
  p.x *= resolution.x / resolution.y;
  vec2 mo = 1.0 / resolution.xy;

  // 摄影机  
  float rx = -0.5 + 3.2*cos(0.1*1.0 + 6.0*mo.x);
  float rz =  0.5 + 3.2*sin(0.1*1.0 + 6.0*mo.x);
  vec3 ro = vec3( rx, 1.0 + 2.0*mo.y, rz );
  vec3 ta = vec3( -0.5, -0.4, 0.5 );

  // camera tx
  vec3 cw = normalize( ta-ro );
  vec3 cp = vec3( 0.0, 1.0, 0.0 );
  vec3 cu = normalize( cross(cw, cp) );
  vec3 cv = normalize( cross(cu, cw) );
  vec3 rd = normalize( p.x*cu + p.y*cv + 2.5*cw );

  // 像素颜色
  vec3 col = render( ro, rd );
  col = pow( col, vec3(0.4545) );
  gl_FragColor=vec4( col, 1.0 );
}
