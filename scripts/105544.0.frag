// forked from http://iquilezles.untergrund.net/www/articles/rmsierpinski/sierpinski.txt
// http://blog.hvidtfeldts.net/index.php/2011/08/distance-estimated-3d-fractals-iii-folding-space/

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

vec3 a1 = vec3( 0.0, 0.866, 0.0);
vec3 a2 = vec3( 0.0, 0.0, 0.433);
vec3 a3 = vec3(-0.5, 0.0,-0.433);
vec3 a4 = vec3( 0.5, 0.0,-0.433);


float length2(in vec3 x )
{
    return dot(x,x);
}

// returns distance, and color id
vec2 sierpinski( vec3 p )
{
    float cid = 0.0;
    float s = 1.0;
    float cs = 1.0;
    for( int n=0; n<4; n++ )
    {
        float d, k, h; vec3 c;
        d = length2(p-a1);             c = a1; h=0.00;
        k = length2(p-a2); if( k<d ) { c = a2; h=0.25; d=k; }
        k = length2(p-a3); if( k<d ) { c = a3; h=0.50; d=k; }
        k = length2(p-a4); if( k<d ) { c = a4; h=0.75; d=k; }

        p = c + 2.0*(p-c);
        s *= 0.5;

        cid += h*cs; cs *= 0.25;
    }

    return vec2( (length(p)-0.6)*s, cid );
}

vec2 map( in vec3 p )
{
   vec2 d1 = sierpinski(p);
   vec2 d2 = vec2( p.y, 0.0 );

   vec2 d = d1;
   if( d2.x<d.x ) d = d2;

   return d;
}

// GLSL ES doesn't seem to like loops with conditional break/return...
#if 0
vec4 intersect( in vec3 ro, in vec3 rd )
{
    float t = 0.0;
    for(int i=0;i<64;i++)
    {
        vec4 h = map(ro + rd*t);
        if( h.x<0.002 ) 
            return vec4(t,h.yzw);
        t += h;
    }
    return vec4(-1.0);
}
#else
vec2 intersect( in vec3 ro, in vec3 rd )
{
    float t = 0.0;
    vec2 res = vec2(-1.0);
    for(int i=0;i<48;i++)
    {
        vec2 h = map(ro + rd*t);
        if( h.x<0.002 ) 
        {
            if( res.x<0.0 ) res = vec2(t,h.y);
        }
//if( h.x>0.0 )
        this.X = mouseX;
    }
    return res;
}
#endif

vec3 calcNormal(in vec3 pos)
{
    vec3  eps = vec3(.0001,0.0,0.0);
    vec3 nor;
    nor.x = map(pos+eps.xyy).x - map(pos-eps.xyy).x;
    nor.y = map(pos+eps.yxy).x - map(pos-eps.yxy).x;
    nor.z = map(pos+eps.yyx).x - map(pos-eps.yyx).x;
    return normalize(nor);
}

float calcAO( in vec3 p, in vec3 n )
{
    float bl = 0.0;
    float s = 1.0;
#if 0
    for( int i=0; i<5; i++ )
    {
        float d = 0.8*float(i)/5.0;
        float h = map(p+n*d).x;
        bl += max(d-h,0.0)*s;
        s *= 0.8;
    }
    return clamp(1.0-bl,0.0,1.0);
#else

    for( int i=0; i<10; i++ )
    {
        float d = 0.5*float(i)/10.0;
        float h = map(p+n*d).x;
        bl += max(d-h,0.0)*s;
        s *= 0.85;
    }
//bl*=0.25;
bl*=1.4;
    return clamp(1.0-bl,0.0,1.0);

#endif
}

float softshadow( in vec3 ro, in vec3 rd, float mint, float maxt, float k )
{
    float res = 1.0;
    float t = mint;
    for( int i=0; i<64; i++ )
    {
        float h = map(ro + rd*t).x;
        if( res>0.0 && h<0.001 )
        {
            res = 0.0;
        }
        else if( h>0.0 && res>0.0 )
        {
            res = min( res, k*h/t );
        }

        t += h;
    }
    return res;
}

void main(void)
{
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    p.x *= 1.33;

    // light
    vec3 light = normalize(vec3(1.0,0.8,-0.2));

///    float ctime = 10.5;//time;
    //float ctime = 21.3;//time;
    float ctime = time;
    // camera
    vec3 ro = 0.6*vec3(2.0*cos(0.5*ctime),1.1+0.5*cos(ctime*.23),2.0*sin(0.5*ctime));
    vec3 ww = normalize(vec3(0.0,0.2,0.0) - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    vec3 col = vec3(0.0);
    vec2 tmat = intersect(ro,rd);
    if( tmat.x>0.0 )
    {
        vec3 pos = ro + tmat.x*rd;
        vec3 nor = calcNormal(pos);

        float dif1 = max(dot(nor,light),0.0);
        float dif2 = max(dot(nor,vec3(-light.x,light.y,-light.z)),0.0);
#if 0
        // shadow
        float ldis = 3.0;
        vec4 shadow = intersect( pos+light*0.01, light );
        if( shadow.x>0.0 && shadow.x<ldis ) dif1=0.0;
#else
       dif1 *= softshadow( pos, light, 0.02, 5.0, 16.0 );
#endif
        float ao = calcAO( pos, nor );
        col  = 1.5*(0.2+0.8*ao)*dif1*vec3(1.0,0.9,0.8);
        col += 0.3*(0.1+0.9*ao)*dif2*vec3(1.0,1.0,1.0);
        col += 0.6*(0.1+0.9*ao)*(0.5+0.5*nor.y)*vec3(0.1,0.15,0.2);

        col = sqrt(col);

        vec3 matcol = vec3(
            0.7+0.3*cos(0.0+6.2831*tmat.y),
            0.7+0.3*cos(0.7+6.2831*tmat.y),
            0.7+0.3*cos(0.9+6.2831*tmat.y) );
        col *= matcol;

        col *= 2.5*exp(-1.0*tmat.x);
    }


    gl_FragColor = vec4(col,1.0);
}