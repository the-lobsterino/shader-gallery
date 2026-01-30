#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// shadertoy emulation - https://www.shadertoy.com/view/7dyBz3
#define iTime time
#define iResolution resolution

// https://www.shadertoy.com/view/7dyBz3

vec4 sdBezierExtrude(vec3 pos, vec3 A, vec3 B, vec3 C)
{    
    vec3 a = B - A;
    vec3 b = A - 2.0*B + C;
    vec3 c = a * 2.0;
    vec3 d = A - pos;

    float kk = 1.0 / dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
    float kz = kk * dot(d,a);      

    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
    float h = q*q + 4.0*p3;
    float t;

    if(h >= 0.0) 
    { 
        h = sqrt(h);
        vec2 x = (vec2(h, -h) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        t = clamp(uv.x+uv.y-kx, 0.0, 1.0);
    }
    else
    {
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3 _t = clamp( vec3(m+m,-n-m,n-m)*z-kx, 0.0, 1.0);
	vec3 r1 = d + (c + b * _t.x) * _t.x;
	vec3 r2 = d + (c + b * _t.y) * _t.y;
        t = dot(r2,r2) < dot(r1,r1) ? _t.y : _t.x;
    }
    
    vec3 _tan = normalize((2.0 - 2.0 * t) * (B - A) + 2.0 * t * (C - B));
    vec3 _bin = normalize(cross(vec3(0.0, 1.0, 0.0), _tan));
    vec3 _nor = cross(_tan, _bin);
    vec3 t1 = cross(_nor, _tan);
    mat3 mm = mat3(t1, cross(_tan, t1), _tan);
    pos.xyz = mix(mix(A, B, t), mix(B, C, t), t) - pos;
    return vec4(pos.xyz*mm, t);
}

// iq
float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

mat2 rot(float a)
{
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}
float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

vec2 smoothRot(vec2 p,float s,float m,float c,float d)
{
  s*=0.5;
  float k=length(p);
  float x=asin(sin(atan(p.x,p.y)*s)*(1.0-m))*k;
  float ds=k*s;
  float y=mix(ds,2.0*ds-sqrt(x*x+ds*ds),c);
  return vec2(x/s,y/s-d);
}

float map( in vec3 pos )
{
	
    pos.zx = smoothRot(pos.xz,16.0,0.35,1.0,3.5+(sin(iTime)*4.0));
	
	
    vec3 a = vec3(-3.5,0.0,0.0);
    vec3 b = vec3(0.0,sin(iTime*0.5)*5.0,0.0);
    vec3 c = vec3(3.5,0.0,0.0);
    vec4 bz = sdBezierExtrude(pos,a,b,c);
	
	
    float tw = (0.5+sin(iTime*1.55)*0.5)*0.5;
    bz.xy *= rot( (3.14*tw) * bz.w);
	
	
	float d1 = length(pos-c)-1.75;
	float d2 = length(pos-a)-.5;
	
	
    float d =  sdBox(bz.xyz, vec3(0.1+(2.0*bz.w),0.1,.05));
	float sm=0.5;
    d =  smin(d,sdBox(bz.xyz, vec3(0.1,0.1+(2.0*bz.w),.05)),sm);
	
	d=smin(d,-d1,-sm);
	d=smin(d,d2,sm);
	d-=0.1;
    return  d*0.6;
}

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.05;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}
    

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     // cam
    float an = 0.5*iTime;
    vec3 ro = vec3( 11.*cos(an), 14.0, 11.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    // raymarch
    const float tmax = 50.0;
    float t = 0.0;
    for( int i=0; i<256; i++ )
    {
    	vec3 pos = ro + t*rd;
        float h = map(pos);
        if( h<0.01 || t>tmax ) break;
        t += h;
    }
    
     // shading/lighting
     vec3 col = vec3(0.1,0.1,0.1)*smoothstep(1.0,0.0,abs(p.y));
     if( t<tmax )
     {
         vec3 pos = ro + t*rd;
         vec3 nor = calcNormal(pos);
         vec3 rf = reflect(ww, nor);
         float sha = map(pos+rf) + .5;
         float factor = sha*length(sin(rf*3.)*0.5+0.5)/sqrt(2.);
         col = mix(vec3(0.15,0.05,0.26), vec3(0.74,0.41,0.62), factor) + pow(factor*0.7, 6.);
     }

     fragColor = vec4( sqrt( col ), 1.0 );
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}