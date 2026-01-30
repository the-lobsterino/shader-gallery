// Original shader: https://www.shadertoy.com/view/WsSBzh

precision mediump float;
uniform float time;
uniform vec2 resolution,mouse;

#define ZERO 0

// https://iquilezles.org/articles/smin
float smin( float a, float b, float k )
{
    float h = max(k-abs(a-b),0.0);
    return min(a, b) - h*h*0.25/k;
}

// https://iquilezles.org/articles/smin
float smax( float a, float b, float k )
{
    k *= 1.4;
    float h = max(k-abs(a-b),0.0);
    return max(a, b) + h*h*h/(6.0*k*k);
}

// https://iquilezles.org/articles/smin
float smin3( float a, float b, float k )
{
    k *= 1.4;
    float h = max(k-abs(a-b),0.0);
    return min(a, b) - h*h*h/(6.0*k*k);
}

// https://iquilezles.org/articles/smin
float sclamp(in float x, in float a, in float b )
{
    float k = 0.1;
	return smax(smin(x,b,k),a,k);
}

// https://iquilezles.org/articles/distfunctions
float opOnion( in float sdf, in float thickness )
{
    return abs(sdf)-thickness;
}

// https://iquilezles.org/articles/distfunctions
float opRepLim( in float p, in float s, in float lima, in float limb )
{
    return p-s*clamp(floor(p/s + 0.5),lima,limb);
}

float det( vec2 a, vec2 b ) { return a.x*b.y-b.x*a.y; }
float ndot(vec2 a, vec2 b ) { return a.x*b.x-a.y*b.y; }
float dot2( in vec2 v ) { return dot(v,v); }
float dot2( in vec3 v ) { return dot(v,v); }

// https://iquilezles.org/articles/distfunctions
float sdTorus( in vec3 p, in float ra, in float rb )
{
    return length( vec2(length(p.xz)-ra,p.y) )-rb;
}

// https://iquilezles.org/articles/distfunctions
float sdCappedTorus(in vec3 p, in vec2 sc, in float ra, in float rb)
{
    p.x = abs(p.x);
    float k = (sc.y*p.x>sc.x*p.z) ? dot(p.xz,sc) : length(p.xz);
    return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}

// https://iquilezles.org/articles/distfunctions
float sdSphere( in vec3 p, in float r ) 
{
    return length(p)-r;
}

// https://iquilezles.org/articles/distfunctions
float sdEllipsoid( in vec3 p, in vec3 r ) 
{
    float k0 = length(p/r);
    float k1 = length(p/(r*r));
    return k0*(k0-1.0)/k1;
}

// https://iquilezles.org/articles/distfunctions
float sdBox( in vec3 p, in vec3 b )
{
    vec3 d = abs(p) - b;
    return min( max(max(d.x,d.y),d.z),0.0) + length(max(d,0.0));
}

// https://iquilezles.org/articles/distfunctions
float sdArc( in vec2 p, in vec2 scb, in float ra )
{
    p.x = abs(p.x);
    float k = (scb.y*p.x>scb.x*p.y) ? dot(p.xy,scb) : length(p.xy);
    return sqrt( dot(p,p) + ra*ra - 2.0*ra*k );
}

// http://research.microsoft.com/en-us/um/people/hoppe/ravg.pdf
// { dist, t, y (above the plane of the curve, x (away from curve in the plane of the curve))
vec4 sdBezier( vec3 p, vec3 va, vec3 vb, vec3 vc )
{
  vec3 w = normalize( cross( vc-vb, va-vb ) );
  vec3 u = normalize( vc-vb );
  vec3 v =          ( cross( w, u ) );
  //----  
  vec2 m = vec2( dot(va-vb,u), dot(va-vb,v) );
  vec2 n = vec2( dot(vc-vb,u), dot(vc-vb,v) );
  vec3 q = vec3( dot( p-vb,u), dot( p-vb,v), dot(p-vb,w) );
  //----  
  float mn = det(m,n);
  float mq = det(m,q.xy);
  float nq = det(n,q.xy);
  //----  
  vec2  g = (nq+mq+mn)*n + (nq+mq-mn)*m;
  float f = (nq-mq+mn)*(nq-mq+mn) + 4.0*mq*nq;
  vec2  z = 0.5*f*vec2(-g.y,g.x)/dot(g,g);
//float t = clamp(0.5+0.5*(det(z,m+n)+mq+nq)/mn, 0.0 ,1.0 );
  float t = clamp(0.5+0.5*(det(z-q.xy,m+n))/mn, 0.0 ,1.0 );
  vec2 cp = m*(1.0-t)*(1.0-t) + n*t*t - q.xy;
  //----  
  float d2 = dot(cp,cp);
  return vec4(sqrt(d2+q.z*q.z), t, q.z, -sign(f)*sqrt(d2) );
}

// https://iquilezles.org/articles/distfunctions
vec2 sdSegment(vec3 p, vec3 a, vec3 b)
{
    vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return vec2( length( pa - ba*h ), h );
}

// https://iquilezles.org/articles/distfunctions
vec2 sdSegmentOri(vec2 p, vec2 b)
{
	float h = clamp( dot(p,b)/dot(b,b), 0.0, 1.0 );
	return vec2( length( p - b*h ), h );
}

// https://iquilezles.org/articles/distfunctions
float sdFakeRoundCone(vec3 p, float b, float r1, float r2)
{
    float h = clamp( p.y/b, 0.0, 1.0 );
    p.y -= b*h;
	return length(p) - mix(r1,r2,h);
}

// https://iquilezles.org/articles/distfunctions
float sdCone( in vec3 p, in vec2 c )
{
  vec2 q = vec2( length(p.xz), p.y );

  vec2 a = q - c*clamp( (q.x*c.x+q.y*c.y)/dot(c,c), 0.0, 1.0 );
  vec2 b = q - c*vec2( clamp( q.x/c.x, 0.0, 1.0 ), 1.0 );
  
  float s = -sign( c.y );
  vec2 d = min( vec2( dot( a, a ), s*(q.x*c.y-q.y*c.x) ),
			    vec2( dot( b, b ), s*(q.y-c.y)  ));
  return -sqrt(d.x)*sign(d.y);
}

// https://iquilezles.org/articles/distfunctions
float sdRhombus(vec3 p, float la, float lb, float h, float ra)
{
    p = abs(p);
    vec2 b = vec2(la,lb);
    float f = clamp( (ndot(b,b-2.0*p.xz))/dot(b,b), -1.0, 1.0 );
	vec2 q = vec2(length(p.xz-0.5*b*vec2(1.0-f,1.0+f))*sign(p.x*b.y+p.z*b.x-b.x*b.y)-ra, p.y-h);
    return min(max(q.x,q.y),0.0) + length(max(q,0.0));
}

// https://iquilezles.org/articles/distfunctions
vec4 opElongate( in vec3 p, in vec3 h )
{
    vec3 q = abs(p)-h;
    return vec4( max(q,0.0), min(max(q.x,max(q.y,q.z)),0.0) );
}

//-----------------------------------------------

// ray-infinite-cylinder intersection
vec2 iCylinderY( in vec3 ro, in vec3 rd, in float rad )
{
	vec3 oc = ro;
    float a = dot( rd.xz, rd.xz );
	float b = dot( oc.xz, rd.xz );
	float c = dot( oc.xz, oc.xz ) - rad*rad;
	float h = b*b - a*c;
	if( h<0.0 ) return vec2(-1.0);
    h = sqrt(h);
	return vec2(-b-h,-b+h)/a;
}

// ray-infinite-cone intersection
vec2 iConeY(in vec3 ro, in vec3 rd, in float k )
{
	float a = dot(rd.xz,rd.xz) - k*rd.y*rd.y;
    float b = dot(ro.xz,rd.xz) - k*ro.y*rd.y;
    float c = dot(ro.xz,ro.xz) - k*ro.y*ro.y; 
        
    float h = b*b-a*c;
    if( h<0.0 ) return vec2(-1.0);
    h = sqrt(h);
    return vec2(-b-h,-b+h)/a;
}

//-----------------------------------------------

float linearstep(float a, float b, in float x )
{
    return clamp( (x-a)/(b-a), 0.0, 1.0 );
}

vec2 rot( in vec2 p, in float an )
{
    float cc = cos(an);
    float ss = sin(an);
    return mat2(cc,-ss,ss,cc)*p;
}

float expSustainedImpulse( float t, float f, float k )
{
    return smoothstep(0.0,f,t)*1.1 - 0.1*exp2(-k*max(t-f,0.0));
}


//---------------------------------------

float bnoise( in float x )
{
    float i = floor(x);
    float f = fract(x);
    float s = sign(fract(x/2.0)-0.5);
    float k = 0.5+0.5*sin(i);
    return s*f*(f-1.0)*((16.0*k-4.0)*f*(f-1.0)-1.0);
}
vec3 fbm13( in float x, in float g )
{    
    vec3 n = vec3(0.0);
    float s = 1.0;
    for( int i=0; i<6; i++ )
    {
        n += s*vec3(bnoise(x),bnoise(x+13.314),bnoise(x+31.7211));
        s *= g;
        x *= 2.01;
        x += 0.131;
    }
    return n;
}

//--------------------------------------------------
//const float X1 = 1.6180339887498948; const float H1 = float( 1.0/X1 );
//const float X2 = 1.3247179572447460; const vec2  H2 = vec2(  1.0/X2, 1.0/(X2*X2) );
//const float X3 = 1.2207440846057595; const vec3  H3 = vec3(  1.0/X3, 1.0/(X3*X3), 1.0/(X3*X3*X3) );
  const float X4 = 1.1673039782614187; const vec4  H4 = vec4(  1.0/X4, 1.0/(X4*X4), 1.0/(X4*X4*X4), 1.0/(X4*X4*X4*X4) );

//--------------------------------------
mat3 calcCamera( in float time, out vec3 oRo, out float oFl )
{
    vec3 ta = vec3( 0.0, -0.3, 0.0 );
    vec3 ro = vec3( -0.5563+1.-2.*mouse.x, -0.2+1.-2.*mouse.y, 2.7442 );
    float fl = 1.7;
    vec3 fb1 = fbm13( 0.15*time, 0.50 );
    ro.xyz += 0.010*fb1.xyz;
    vec3 fb2 = fbm13( 0.33*time, 0.65 );
    fb2 = fb2*fb2*sign(fb2);
    ta.xy += 0.005*fb2.xy;
    float cr = -0.01 + 0.002*fb2.z;
    
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(cr),cos(cr),0.0) ) );
    vec3 vv =          ( cross(uu,ww));
    
    oRo = ro;
    oFl = fl;

    return mat3(uu,vv,ww);
}

// This SDF is really 6 braids at once (through domain
// repetition) with three strands each (brute forced)
vec4 sdHair( vec3 p, vec3 pa, vec3 pb, vec3 pc, float an, out vec2 occ_id) 
{
    vec4 b = sdBezier(p, pa,pb,pc );
    vec2 q = rot(b.zw,an);
  	
    vec2 id2 = floor(q/0.1 + 0.5);
    id2 = clamp(id2,vec2(0),vec2(2,1));
    q -= 0.1*id2;

    float id = 11.0*id2.x + id2.y*13.0;

    q += smoothstep(0.5,0.8+pow(sin(time/4.),2.)/3.,b.y)*0.062*vec2(0.4,1.5)*cos( 23.0*b.y + id*vec2(13,17));

    occ_id.x = clamp(length(q)*8.0-0.2,0.0,1.0);
    vec4 res = vec4(99,q,b.y);
    for( int i=0; i<3; i++ )
    {
        vec2 tmp = q + 0.01*cos( id + 180.0*b.y + vec2(2*i,6-2*i));
        float lt = length(tmp)-0.02;
        if( lt<res.x )
        { 
            occ_id.y = id+float(i); 
            res.x = lt; 
            res.yz = tmp;
        }
    }
    return res;
}

// The SDF for the hoodie and jacket. It's a very distorted
// ellipsoid, torus section, a segment and a sphere.
vec4 sdHoodie( in vec3 pos )
{
    vec3 opos = pos;

    pos.x   += 0.09*sin(3.5*pos.y-0.5)*sin(    pos.z) + 0.015;
    pos.xyz += 0.03*sin(2.0*pos.y)*sin(7.0*pos.zyx);
    
    // hoodie
    vec3 hos = pos-vec3(0.0,-0.33,0.15);
    hos.x -= 0.031*smoothstep(0.0,1.0,opos.y+0.33);
    hos.yz = rot(hos.yz,0.9);
    float d1 = sdEllipsoid(hos,vec3(0.96-pos.y*0.1,1.23,1.5));
	float d2 = 0.95*pos.z-0.312*pos.y-0.9;
    float d = max(opOnion(d1,0.01), d2 );
    
    // shoulders
    vec3 sos = vec3( abs(pos.x), pos.yz );    
    vec2 se = sdSegment(sos, vec3(0.18,-1.6,-0.3), vec3(1.1,-1.9,0.0) );
    d = smin(d,se.x-mix(0.25,0.43,se.y),0.4);
    d = smin(d,sdSphere(sos-vec3(0.3,-2.2,0.4), 0.5 ),0.2);

    // neck
    opos.x -= 0.02*sin(9.0*opos.y);
    vec4 w = opElongate( opos-vec3(0.0,-1.2,0.3), vec3(0.0,0.3,0.0) );
    d = smin(d,
             w.w+sdCappedTorus(vec3(w.xy,-w.z),vec2(0.6,-0.8),0.6,0.02),
             0.1);
    
    // bumps
    d += 0.004*sin(pos.x*90.0)*sin(pos.y*90.0)*sin(pos.z*90.0);
    d -= 0.002*sin(pos.x*300.0);
    d -= 0.02*(1.0-smoothstep(0.0,0.04,abs(opOnion(pos.x,1.1))));
    
    // border
    d = min(d,length(vec2(d1,d2))-0.015);
    
    return vec4(d,pos);
}

// moves the head (and hair and hoodie). This could be done
// more efficiently (with a single matrix or quaternion),
// but this code was optimized for editing, not for runtime
vec3 moveHead( in vec3 pos, in vec3 an, in float amount)
{
    pos.y -= -1.0;
    pos.xz = rot(pos.xz,amount*an.x);
    pos.xy = rot(pos.xy,amount*an.y);
    pos.yz = rot(pos.yz,amount*an.z);
    pos.y += -1.0;
    return pos;
}

// the animation state
vec3 animData; // { blink, nose follow up, mouth } 
vec3 animHead; // { head rotation angles }

vec4 map( in vec3 pos, in float time, out float outMat, out vec3 uvw )
{
    outMat = 1.0;

    vec3 oriPos = pos;
    
    // head deformation and transformation
    pos.y /= 1.04;
    vec3 opos;
    opos = moveHead( pos, animHead, smoothstep(-1.2, 0.2,pos.y) );
    pos  = moveHead( pos, animHead, smoothstep(-1.4,-1.0,pos.y) );
    pos.x *= 1.04;
    pos.y /= 1.02;
    uvw = pos;

    // symmetric coord systems (sharp, and smooth)
    vec3 qos = vec3(abs(pos.x),pos.yz);
    vec3 sos = vec3(sqrt(qos.x*qos.x+0.0005),pos.yz);
    
    // head
    float d = sdEllipsoid( pos-vec3(0.0,0.05,0.07), vec3(0.8,0.75,0.85) );
    
    // jaw
    vec3 mos = pos-vec3(0.0,-0.38,0.35); mos.yz = rot(mos.yz,0.4);
	mos.yz = rot(mos.yz,0.1*animData.z);
	float d2 = sdEllipsoid(mos-vec3(0,-0.17,0.16),
                 vec3(0.66+sclamp(mos.y*0.9-0.1*mos.z,-0.3,0.4),
                 	  0.43+sclamp(mos.y*0.5,-0.5,0.2),
                      0.50+sclamp(mos.y*0.3,-0.45,0.5)));
        
    // mouth hole
    d2 = smax(d2,-sdEllipsoid(mos-vec3(0,0.06,0.6+0.05*animData.z), vec3(0.16,0.035+0.05*animData.z,0.1)),0.01);
    
    // lower lip    
    vec4 b = sdBezier(vec3(abs(mos.x),mos.yz), 
                      vec3(0,0.01,0.61),
                      vec3(0.094+0.01*animData.z,0.015,0.61),
                      vec3(0.18-0.02*animData.z,0.06+animData.z*0.05,0.57-0.006*animData.z));
    float isLip = smoothstep(0.045,0.04,b.x+b.y*0.03);
    d2 = smin(d2,b.x - 0.027*(1.0-b.y*b.y)*smoothstep(1.0,0.4,b.y),0.02);
    d = smin(d,d2,0.19);

    // chicks
    d = smin(d,sdSphere(qos-vec3(0.2,-0.33,0.62),0.28 ),0.04);
    
    // who needs ears
    
    // eye sockets
    vec3 eos = sos-vec3(0.3,-0.04,0.7);
    eos.xz = rot(eos.xz,-0.2);
    eos.xy = rot(eos.xy,0.3);
    eos.yz = rot(eos.yz,-0.2);
    d2 = sdEllipsoid( eos-vec3(-0.05,-0.05,0.2), vec3(0.20,0.14-0.06*animData.x,0.1) );
	d = smax( d, -d2, 0.15 );

    eos = sos-vec3(0.32,-0.08,0.8);
    eos.xz = rot(eos.xz,-0.4);
    d2 = sdEllipsoid( eos, vec3(0.154,0.11,0.1) );
    d = smax( d, -d2, 0.05 );

    vec3 oos = qos - vec3(0.25,-0.06,0.42);
    
    // eyelid
    d2 = sdSphere( oos, 0.4 );
    oos.xz = rot(oos.xz, -0.2);
    oos.xy = rot(oos.xy, 0.2);
    vec3 tos = oos;        
    oos.yz = rot(oos.yz,-0.6+0.58*animData.x);

    //eyebags
    tos = tos-vec3(-0.02,0.06,0.2+0.02*animData.x);
    tos.yz = rot(tos.yz,0.8);
    tos.xy = rot(tos.xy,-0.2);
	d = smin( d, sdTorus(tos,0.29,0.01), 0.03 );
    
    // eyelids
    eos = qos - vec3(0.33,-0.07,0.53);
    eos.xy = rot(eos.xy, 0.2);
    eos.yz = rot(eos.yz,0.35-0.25*animData.x);
    d2 = smax(d2-0.005, -max(oos.y+0.098,-eos.y-0.025), 0.02 );
    d = smin( d, d2, 0.012 );

	// eyelashes
	oos.x -= 0.01;
    float xx = clamp( oos.x+0.17,0.0,1.0);
    float ra = 0.35 + 0.1*sqrt(xx/0.2)*(1.0-smoothstep(0.3,0.4,xx))*(0.6+0.4*sin(xx*256.0));
    float rc = 0.18/(1.0-0.7*smoothstep(0.15,0.5,animData.x));
    oos.y -= -0.18 - (rc-0.18)/1.8;
    d2 = (1.0/1.8)*sdArc( oos.xy*vec2(1.0,1.8), vec2(0.9,sqrt(1.0-0.9*0.9)), rc )-0.001;
    float deyelashes = max(d2,length(oos.xz)-ra)-0.003;
    
    // nose
    eos = pos-vec3(0.0,-0.079+animData.y*0.005,0.86);
    eos.yz = rot(eos.yz,-0.23);
    float h = smoothstep(0.0,0.26,-eos.y);
    d2 = sdCone( eos-vec3(0.0,-0.02,0.0), vec2(0.03,-0.25) )-0.04*h-0.01;
    eos.x = sqrt(eos.x*eos.x + 0.001);
    d2 = smin( d2, sdSphere(eos-vec3(0.0, -0.25,0.037),0.06 ), 0.07 );
    d2 = smin( d2, sdSphere(eos-vec3(0.1, -0.27,0.03 ),0.04 ), 0.07 );
    d2 = smin( d2, sdSphere(eos-vec3(0.0, -0.32,0.05 ),0.025), 0.04 );        
    d2 = smax( d2,-sdSphere(eos-vec3(0.07,-0.31,0.038),0.02 ), 0.035 );
    d = smin(d,d2,0.05-0.03*h);
    
    // mouth
    eos = pos-vec3(0.0,-0.38+animData.y*0.003+0.01*animData.z,0.71);
    tos = eos-vec3(0.0,-0.13,0.06);
    tos.yz = rot(tos.yz,0.2);
    float dTeeth = sdTorus(tos,0.15,0.015);
    eos.yz = rot(eos.yz,-0.5);
    eos.x /= 1.04;

    // nose-to-upperlip connection
    d2 = sdCone( eos-vec3(0,0,0.03), vec2(0.14,-0.2) )-0.03;
    d2 = max(d2,-(eos.z-0.03));
    d = smin(d,d2,0.05);

    // upper lip
    eos.x = abs(eos.x);
    b = sdBezier(eos, vec3(0.00,-0.22,0.17),
                      vec3(0.08,-0.22,0.17),
                      vec3(0.17-0.02*animData.z,-0.24-0.01*animData.z,0.08));
    d2 = length(b.zw/vec2(0.5,1.0)) - 0.03*clamp(1.0-b.y*b.y,0.0,1.0);
    d = smin(d,d2,0.02);
    isLip = max(isLip,(smoothstep(0.03,0.005,abs(b.z+0.015+abs(eos.x)*0.04))
                 -smoothstep(0.45,0.47,eos.x-eos.y*1.15)));

    // valley under nose
    vec2 se = sdSegment(pos, vec3(0.0,-0.45,1.01),  vec3(0.0,-0.47,1.09) );
    d2 = se.x-0.03-0.06*se.y;
    d = smax(d,-d2,0.04);
    isLip *= smoothstep(0.01,0.03,d2);

    // neck
    se = sdSegment(pos, vec3(0.0,-0.65,0.0), vec3(0.0,-1.7,-0.1) );
    d2 = se.x - 0.38;

    // shoulders
    se = sdSegment(sos, vec3(0.0,-1.55,0.0), vec3(0.6,-1.65,0.0) );
    d2 = smin(d2,se.x-0.21,0.1);
    d = smin(d,d2,0.4);
        
    // register eyelases now
    vec4 res = vec4( d, isLip, 0, 0 );
    if( deyelashes<res.x )
    {
        res.x = deyelashes*0.8;
        res.yzw = vec3(0.0,1.0,0.0);
    }
    // register teeth now
    if( dTeeth<res.x )
    {
        res.x = dTeeth;
        outMat = 5.0;
    }
 
    // eyes
	pos.x /=1.05;        
    eos = qos-vec3(0.25,-0.06,0.42);
    d2 = sdSphere(eos,0.4);
    if( d2<res.x ) 
    { 
        res.x = d2;
     	outMat = 2.0;
        uvw = pos;
    }
        
    // hair
    {
        vec2 occ_id, tmp;
		qos = pos; qos.x=abs(pos.x);

        vec4 pres = sdHair(pos,vec3(-0.3, 0.55,0.8), 
                               vec3( 0.95, 0.7,0.85), 
                               vec3( 0.4,-1.45,0.95),
                               -0.9,occ_id);

        vec4 pres2 = sdHair(pos,vec3(-0.4, 0.6,0.55), 
                                vec3(-1.0, 0.4,0.2), 
                                vec3(-0.6,-1.4,0.7),
                                0.6,tmp);
        if( pres2.x<pres.x ) { pres=pres2; occ_id=tmp;  occ_id.y+=40.0;}

        pres2 = sdHair(qos,vec3( 0.4, 0.7,0.4), 
                           vec3( 1.0, 0.5,0.45), 
                           vec3( 0.4,-1.45,0.55),
                           -0.2,tmp);
        if( pres2.x<pres.x ) { pres=pres2; occ_id=tmp;  occ_id.y+=80.0;}
    

        pres.x *= 0.8;
        if( pres.x<res.x )
        {
            res = vec4( pres.x, occ_id.y, 0.0, occ_id.x );
            uvw = pres.yzw;
            outMat = 4.0;
        }
    }

    // hoodie
    vec4 tmp = sdHoodie( opos );
    if( tmp.x<res.x )
    {
        res.x = tmp.x;
        outMat = 3.0;
        uvw  = tmp.yzw;
    }

    return res;
}

// Computes the normal of the girl's surface (the gradient
// of the SDF). The implementation is weird because of the
// technicalities of the WebGL API that forces us to do
// some trick to prevent code unrolling. More info here:
//
// https://iquilezles.org/articles/normalsSDF
//
vec3 calcNormal( in vec3 pos, in float time )
{
    const float eps = 0.001;
    vec4 n = vec4(0.0);
    for( int i=ZERO; i<4; i++ )
    {
        vec4 s = vec4(pos, 0.0);
        float kk; vec3 kk2;
        s[i] += eps;
    float matID;
    vec3 uvw;
        n[i] = map(s.xyz, time, matID, uvw).x; 
      //if( n.x+n.y+n.z+n.w>100.0 ) break;
    }
    return normalize(n.xyz-n.w);
}

// Compute soft shadows for a given light, with a single
// ray insead of using montecarlo integration or shadowmap
// blurring. More info here:
//
// https://iquilezles.org/articles/rmshadows
//
float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax, in float time, float k )
{
    // first things first - let's do a bounding volume test
    vec2 sph = iCylinderY( ro, rd, 1.5 );
  //vec2 sph = iConeY(ro-vec3(-0.05,3.7,0.35),rd,0.08);
    tmax = min(tmax,sph.y);

    // raymarch and track penumbra    
    float res = 1.0;
    float t = mint;
    for( int i=0; i<128; i++ )
    {
        float kk; vec3 kk2;
		float h = map( ro + rd*t, time, kk, kk2 ).x;
        res = min( res, k*h/t );
        t += clamp( h, 0.005, 0.1 );
        if( res<0.002 || t>tmax ) break;
    }
    return max( res, 0.0 );
}

// Computes convexity for our girl SDF, which can be used
// to approximate ambient occlusion. More info here:
//
// https://iquilezles.org/www/material/nvscene2008/rwwtt.pdf
//
float calcOcclusion( in vec3 pos, in vec3 nor, in float time )
{
    float kk; vec3 kk2;
	float ao = 0.0;
    float off = 0.0;
    vec4 k = vec4(0.7012912,0.3941462,0.8294585,0.109841)+off;
    for( int i=ZERO; i<16; i++ )
    {
		k = fract(k + H4);
        vec3 ap = normalize(-1.0+2.0*k.xyz);
        float h = k.w*0.1;
        ap = (nor+ap)*h;
        float d = map( pos+ap, time, kk, kk2 ).x;
        ao += max(0.0,h-d);
        if( ao>16.0 ) break;
    }
	ao /= 16.0;
    return clamp( 1.0-ao*24.0, 0.0, 1.0 );
}

// Computes the intersection point between our girl SDF and
// a ray (coming form the camera in this case). It's a
// traditional and basic/uncomplicated SDF raymarcher. More
// info here:
//
// https://iquilezles.org/www/material/nvscene2008/rwwtt.pdf
//
vec2 intersect( in vec3 ro, in vec3 rd, in float tmax, in float time, out vec3 cma, out vec3 uvw )
{
    cma = vec3(0.0);
    uvw = vec3(0.0);
    float matID = -1.0;

    float t = 1.0;
    
    // bounding volume test first
    vec2 sph = iCylinderY( ro, rd, 1.5 );
  //vec2 sph = iConeY(ro-vec3(-0.05,3.7,0.35),rd,0.08);
    if( sph.y<0.0 ) return vec2(-1.0);
    
    // clip raymarch space to bonding volume
    tmax = min(tmax,sph.y);
    t    = max(1.0, sph.x);
    
    // raymarch
    for( int i=0; i<256; i++ )
    {
        vec3 pos = ro + t*rd;

        float tmp;
        vec4 h = map(pos,time,tmp,uvw);
        if( h.x<0.001 )
        {
            cma = h.yzw;
            matID = tmp;
            break;
        }
        t += h.x*0.95;
        if( t>tmax ) break;
    }

    return vec2(t,matID);
}

// This is a replacement for a traditional dot(N,L) diffuse
// lobe (called N.L in the code) that fakes some subsurface
// scattering (transmision of light thorugh the skin that
// surfaces as a red glow)
//
vec3 sdif( float ndl, float ir )
{
    float pndl = clamp( ndl, 0.0, 1.0 );
    float nndl = clamp(-ndl, 0.0, 1.0 );
    return vec3(pndl) + vec3(1.0,0.1,0.01)*0.7*pow(clamp(ir*0.75-nndl,0.0,1.0),2.0);
}

// Animates the eye central position (not the actual random
// darts). It's carefuly synched with the head motion, to
// make the eyes anticipate the head turn (without this
// anticipation, the eyes and the head are disconnected and
// it all looks like a zombie/animatronic)
//
float animEye( in float time )
{
    const float w = 6.1;
    float t = mod(time-0.31,w*1.0);
    
    float q = fract((time-0.31)/(2.0*w));
    float s = (q > 0.5) ? 1.0 : 0.0;
    return (t<0.15)?1.0-s:s;
}

vec3 renderGirl( in vec2 p, in vec3 ro, in vec3 rd, in float tmax, in vec3 col, in float time )
{
    // --------------------------
    // find ray-girl intersection
    // --------------------------
    vec3 cma, uvw;
    vec2 tm = intersect( ro, rd, tmax, time, cma, uvw );

    // --------------------------
    // shading/lighting	
    // --------------------------
    if( tm.y>0.0 )
    {
        vec3 pos = ro + tm.x*rd;
        vec3 nor = calcNormal(pos, time);

        float ks = 1.0;
        float se = 16.0;
        float tinterShadow = 0.0;
        float sss = 0.0;
        float focc = 1.0;
        //float frsha = 1.0;

        // --------------------------
        // material
        // --------------------------
        if( tm.y<1.5 ) // skin
        {
            vec3 qos = vec3(abs(uvw.x),uvw.yz);

            // base skin color
            col = mix(vec3(0.225,0.15,0.12),
                      vec3(0.24,0.1,0.066),
                      smoothstep(0.4 ,0.0,length( qos.xy-vec2(0.42,-0.3)))+
                      smoothstep(0.15,0.0,length((qos.xy-vec2(0,-0.29))/vec2(1.4,1))));
            
            // fix that ugly highlight
            col -= 0.03*smoothstep(0.13,0.0,length((qos.xy-vec2(0,-0.49))/vec2(2,1)));
                
            // lips
            col = mix(col,vec3(0.14,0.06,0.1),cma.x*step(-0.7,qos.y));
            
            // eyelashes
            col = mix(col,vec3(0.04,0.02,0.02)*0.6,0.9*cma.y);

            // fake skin drag
            uvw.y += 0.025*animData.x*smoothstep(0.3,0.1,length(uvw-vec3(0.0,0.1,1.0)));
			uvw.y -= 0.005*animData.y*smoothstep(0.09,0.0,abs(length((uvw.xy-vec2(0.0,-0.38))/vec2(2.5,1.0))-0.12));
            
            // freckles
            vec2 ti = floor(9.0+uvw.xy/0.04);
            vec2 uv = fract(uvw.xy/0.04)-0.5;
            float te = fract(111.0*sin(1111.0*ti.x+1331.0*ti.y));
            te = smoothstep(0.9,1.0,te)*exp(-dot(uv,uv)*24.0); 
            col *= mix(vec3(1.1),vec3(0.8,0.6,0.4), te);

            // texture for specular
            ks = 0.5;
            se = 12.0;
            ks *= 0.5;
            tinterShadow = 1.0;
            sss = 1.0;
            ks *= 1.0 + cma.x;
            
            // black top
            col *= 1.0-smoothstep(0.48,0.51,uvw.y);
            
            // makeup
            float d2 = sdEllipsoid(qos-vec3(0.25,-0.03,0.43),vec3(0.37,0.42,0.4));
            col = mix(col,vec3(0.06,0.024,0.06),1.0 - smoothstep(0.0,0.03,d2));

            // eyebrows
    		{

            // fixed version
        	vec4 be = sdBezier( qos, vec3(0.16+0.01*animData.x,0.11-0.02*animData.x,0.89),
                                     vec3(0.37,0.18-0.005*animData.x,0.82+0.005*animData.x), 
                                     vec3(0.53,0.15,0.69) );
            float ra = 0.005 + 0.01*sqrt(1.0-be.y);

            float dd = 1.0+0.05*(0.7*sin((sin(qos.x*3.0)/3.0-0.5*qos.y)*350.0)+
                                 0.3*sin((qos.x-0.8*qos.y)*250.0+1.0));
    		float d = be.x - ra*dd;
        	float mask = 1.0-smoothstep(-0.005,0.01,d);
        	col = mix(col,vec3(0.04,0.02,0.02),mask*dd );
        	}

            // fake occlusion
            focc = 0.2+0.8*pow(1.0-smoothstep(-0.4,1.0,uvw.y),2.0);
            focc *= 0.5+0.5*smoothstep(-1.5,-0.75,uvw.y);
            focc *= 1.0-smoothstep(0.4,0.75,abs(uvw.x));
            focc *= 1.0-0.4*smoothstep(0.2,0.5,uvw.y);
            
            focc *= 1.0-smoothstep(1.0,1.3,1.7*uvw.y-uvw.x);
            
            //frsha = 0.0;
        }
        else if( tm.y<2.5 ) // eye
        {
            // The eyes are fake in that they aren't 3D. Instead I simply
			// stamp a 2D mathematical drawing of an iris and pupil. That
			// includes the highlight and occlusion in the eyesballs.
            
            sss = 1.0;

            vec3 qos = vec3(abs(uvw.x),uvw.yz);
			float ss = sign(uvw.x);
            
            // iris animation
            float dt = floor(time*1.1);
            float ft = fract(time*1.1);
            vec2 da0 = sin(1.7*(dt+0.0)) + sin(2.3*(dt+0.0)+vec2(1.0,2.0));
            vec2 da1 = sin(1.7*(dt+1.0)) + sin(2.3*(dt+1.0)+vec2(1.0,2.0));
            vec2 da = mix(da0,da1,smoothstep(0.9,1.0,ft));

            float gg = animEye(time);
            da *= 1.0+0.5*gg;
            qos.yz = rot(qos.yz,da.y*0.004-0.01);
            qos.xz = rot(qos.xz,da.x*0.004*ss-gg*ss*(0.03-step(0.0,ss)*0.014)+0.02);

            vec3 eos = qos-vec3(0.31,-0.055 - 0.03*animData.x,0.45);
            
            // iris
            float r = length(eos.xy)+0.005;
            float a = atan(eos.y,ss*eos.x);
            vec3 iris = vec3(0.09,0.0315,0.0135);
            iris += iris*3.0*(1.0-smoothstep(0.0,1.0, abs((a+3.14159)-2.5) ));
            iris *= 0.35;
            // base color
            col = vec3(0.42);
            col *= 0.1+0.9*smoothstep(0.10,0.114,r);
            col = mix( col, iris, 1.0-smoothstep(0.095,0.10,r) );
            col *= smoothstep(0.05,0.07,r);
			
            // fake occlusion backed in
            float edis = length((vec2(abs(uvw.x),uvw.y)-vec2(0.31,-0.07))/vec2(1.3,1.0));
            col *= mix( vec3(1.0), vec3(0.4,0.2,0.1), linearstep(0.07,0.16,edis) );

            // fake highlight
            qos = vec3(abs(uvw.x),uvw.yz);
            col += (0.5-gg*0.3)*(1.0-smoothstep(0.0,0.02,length(qos.xy-vec2(0.29-0.05*ss,0.0))));
            
            se = 128.0;

            // fake occlusion
            focc = 0.2+0.8*pow(1.0-smoothstep(-0.4,1.0,uvw.y),2.0);
            focc *= 1.0-linearstep(0.10,0.17,edis);
            //frsha = 0.0;
        }
        else if( tm.y<3.5 )// hoodie
        {
            sss = 0.0;
            col = vec3(0.81);
            ks *= 2.0;
            
            // logo
            if( abs(uvw.x)<0.66 )
            {
                float par = length(uvw.yz-vec2(-1.05,0.65));
                col *= mix(vec3(1.0),vec3(0.6,0.2,0.8)*0.7,1.0-smoothstep(0.1,0.11,par));
                col *= smoothstep(0.005,0.010,abs(par-0.105));
            }                

            // fake occlusion
            focc = mix(1.0,
                	   0.03+0.97*smoothstep(-0.15,1.7,uvw.z),
                       smoothstep(-1.6,-1.3,uvw.y)*(1.0-clamp(dot(nor.xz,normalize(uvw.xz)),0.0,1.0))
                      );
            
            //frsha = mix(1.0,
            //            clamp(dot(nor.xz,normalize(uvw.xz)),0.0,1.0),
            //            smoothstep(-1.6,-1.3,uvw.y)
            //           );
            //frsha *= smoothstep(0.85,1.0,length(uvw-vec3(0.0,-1.0,0.0)));
        }
        else if( tm.y<4.5 )// hair
        {
            sss = 0.0;
            col = (sin(cma.x)>0.7) ? vec3(0.03,0.01,0.05)*1.5 :
                                     vec3(0.04,0.02,0.01)*0.4;
            ks *= 0.75 + cma.z*18.0;
            float te = 1.0; //FIXME
            col *= 2.0*te;
            ks *= 1.5*te;
            
			// fake occlusion
            focc  = 1.0-smoothstep(-0.40, 0.8, uvw.y);
            focc *= 1.0-0.95*smoothstep(-1.20,-0.2,-uvw.z);
            focc *= 0.5+cma.z*12.0;
            //frsha = 1.0-smoothstep(-1.3,-0.8,uvw.y);
            //frsha *= 1.0-smoothstep(-1.20,-0.2,-uvw.z);
        }
        else if( tm.y<5.5 )// teeth
        {
            sss = 1.0;
            col = vec3(0.3);
            ks *= 1.5;
            //frsha = 0.0;
        }

        float fre = clamp(1.0+dot(nor,rd),0.0,1.0);
        float occ = focc*calcOcclusion( pos, nor, time );

        // --------------------------
        // lighting. just four lights
        // --------------------------
        vec3 lin = vec3(0.0);

        // fake sss
        float nma = 0.0;
        if( tm.y<1.5 )
        {
        nma = 1.0-smoothstep(0.0,0.12,length((uvw.xy-vec2(0.0,-0.37))/vec2(2.4,0.7)));
        }

        //vec3 lig = normalize(vec3(0.5,0.4,0.6));
        vec3 lig = vec3(0.57,0.46,0.68);
        vec3 hal = normalize(lig-rd);
        float dif = clamp( dot(nor,lig), 0.0, 1.0 );
        //float sha = 0.0; if( dif>0.001 ) sha=calcSoftshadow( pos+nor*0.002, lig, 0.0001, 2.0, time, 5.0 );
        float sha = calcSoftshadow( pos+nor*0.002, lig, 0.0001, 2.0, time, 5.0 );
        float spe = 2.0*ks*pow(clamp(dot(nor,hal),0.0,1.0),se)*dif*sha*(0.04+0.96*pow(clamp(1.0-dot(hal,-rd),0.0,1.0),5.0));

        // fake sss for key light
        vec3 cocc = mix(vec3(occ),
                        vec3(0.1+0.9*occ,0.9*occ+0.1*occ*occ,0.8*occ+0.2*occ*occ),
                        tinterShadow);
        cocc = mix( cocc, vec3(1,0.3,0.0), nma);
        sha = mix(sha,max(sha,0.3),nma);

        vec3  amb = cocc*(0.55 + 0.45*nor.y);
        float bou = clamp(0.3-0.7*nor.x, 0.0, 1.0 );

        lin +=      vec3(0.65,1.05,2.0)*amb*1.15;
        lin += 1.50*vec3(1.60,1.40,1.2)*sdif(dot(nor,lig),0.5+0.3*nma+0.2*(1.0-occ)*tinterShadow) * mix(vec3(sha),vec3(sha,0.2*sha+0.7*sha*sha,0.2*sha+0.7*sha*sha),tinterShadow);
        lin +=      vec3(1.00,0.30,0.1)*sss*fre*0.6*(0.5+0.5*dif*sha*amb)*(0.1+0.9*focc);
        lin += 0.35*vec3(4.00,2.00,1.0)*bou*occ*col;

        col = lin*col + spe + fre*fre*fre*0.1*occ;

        // overall
	col *= 1.1;
    }
    //col = vec3(tm.y, tm.y, tm.y);
    return col;
}

float animTurn( in float time )
{	
    const float w = 6.1;
    float t = mod(time,w*2.0);
    
    vec3 p = (t<w) ? vec3(0.0,0.0,1.0) : vec3(w,1.0,-1.0);
    return p.y + p.z*expSustainedImpulse(t-p.x,1.0,10.0);
}

float animBlink( in float time, in float smo )
{
    // head-turn motivated blink
    const float w = 6.1;
    float t = mod(time-0.31,w*1.0);
    float blink = smoothstep(0.0,0.1,t) - smoothstep(0.18,0.4,t);

    // regular blink
    float tt = mod(1.0+time,3.0);
    blink = max(blink,smoothstep(0.0,0.07+0.07*smo,tt)-smoothstep(0.1+0.04*smo,0.35+0.3*smo,tt));
    
    // keep that eye alive always
    float blinkBase = 0.04*(0.5+0.5*sin(time));
    blink = mix( blinkBase, 1.0, blink );

    // base pose is a bit down
    float down = 0.15;
    return down+(1.0-down)*blink;
}

void main( void )
{
    // render
    vec3 tot = vec3(0.0);
    
        vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy) / resolution.y;
        float time = time;
        
        time += 2.0;
        
        // camera movement	
        vec3 ro; float fl;
        mat3 ca = calcCamera( time, ro, fl );
    	vec3 rd = ca * normalize( vec3((p)/0.9,fl));

        // animation (blink, face follow up, mouth)
        float turn = animTurn( time );
        animData.x = animBlink(time,0.0);
        animData.y = animBlink(time-0.02,1.0);
        animData.z = -0.25 + 0.2*(1.0-turn)*smoothstep(-0.3,0.9,sin(time*1.1)) + 0.05*cos(time*2.7);

        // animation (head orientation)
        animHead = vec3( sin(time*0.5), sin(time*0.3), -cos(time*0.2) );
        animHead = animHead*animHead*animHead;
        animHead.x = -0.025*animHead.x + 0.2*(0.7+0.3*turn);
        animHead.y =  0.1 + 0.02*animHead.y*animHead.y*animHead.y;
        animHead.z = -0.03*(0.5 + 0.5*animHead.z) - (1.0-turn)*0.05;
        
        // rendering
        vec4 tmp = vec4(0.0, 0.0, 1.0, 10.0);
        vec3 col = tmp.xyz;
        float tmin = tmp.w;
        
        //if( p.x*1.4+p.y<0.8 && -p.x*4.5+p.y<6.5 && p.x<0.58)
        col = renderGirl(p,ro,rd,tmin,col,time);
        //else col=vec3(0,1,0);
        
        // gamma        
        col = pow( col, vec3(0.4545) );
	    tot += col;
 
    // compress
    tot = 3.8*tot/(3.0+dot(tot,vec3(0.333)));
  
    // vignette
    vec2 q = gl_FragCoord.xy/resolution.xy;
    tot *= 0.5 + 0.5*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.15);

    // grade
    tot = tot*vec3(1.02,1.00,0.99)+vec3(0.0,0.0,0.045);
       
    gl_FragColor = vec4( tot, 1.0 );
}