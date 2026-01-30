/*
 * Original shader from: https://www.shadertoy.com/view/wttGW4
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define Rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float dBox2d(vec2 p, vec2 b) {
    return max(abs(p.x) - b.x, abs(p.y) - b.y);
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float sdLine( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float sdTriangle( in vec2 p0, in vec2 p1, in vec2 p2, in vec2 p )
{
    vec2 e0 = p1 - p0;
    vec2 e1 = p2 - p1;
    vec2 e2 = p0 - p2;

    vec2 v0 = p - p0;
    vec2 v1 = p - p1;
    vec2 v2 = p - p2;

    vec2 pq0 = v0 - e0*clamp( dot(v0,e0)/dot(e0,e0), 0.0, 1.0 );
    vec2 pq1 = v1 - e1*clamp( dot(v1,e1)/dot(e1,e1), 0.0, 1.0 );
    vec2 pq2 = v2 - e2*clamp( dot(v2,e2)/dot(e2,e2), 0.0, 1.0 );
    
    float s = sign( e0.x*e2.y - e0.y*e2.x );
    vec2 d = min( min( vec2( dot( pq0, pq0 ), s*(v0.x*e0.y-v0.y*e0.x) ),
                       vec2( dot( pq1, pq1 ), s*(v1.x*e1.y-v1.y*e1.x) )),
                       vec2( dot( pq2, pq2 ), s*(v2.x*e2.y-v2.y*e2.x) ));

    return -sqrt(d.x)*sign(d.y);
}

float sdEllipse( in vec2 p, in vec2 ab )
{
    p = abs(p); if( p.x > p.y ) {p=p.yx;ab=ab.yx;}
    float l = ab.y*ab.y - ab.x*ab.x;
    float m = ab.x*p.x/l;      float m2 = m*m; 
    float n = ab.y*p.y/l;      float n2 = n*n; 
    float c = (m2+n2-1.0)/3.0; float c3 = c*c*c;
    float q = c3 + m2*n2*2.0;
    float d = c3 + m2*n2;
    float g = m + m*n2;
    float co;
    if( d<0.0 )
    {
        float h = acos(q/c3)/3.0;
        float s = cos(h);
        float t = sin(h)*sqrt(3.0);
        float rx = sqrt( -c*(s + t + 2.0) + m2 );
        float ry = sqrt( -c*(s - t + 2.0) + m2 );
        co = (ry+sign(l)*rx+abs(g)/(rx*ry)- m)/2.0;
    }
    else
    {
        float h = 2.0*m*n*sqrt( d );
        float s = sign(q+h)*pow(abs(q+h), 1.0/3.0);
        float u = sign(q-h)*pow(abs(q-h), 1.0/3.0);
        float rx = -s - u - c*4.0 + 2.0*m2;
        float ry = (s - u)*sqrt(3.0);
        float rm = sqrt( rx*rx + ry*ry );
        co = (ry/sqrt(rm-rx)+2.0*g/rm-m)/2.0;
    }
    vec2 r = ab * vec2(co, sqrt(1.0-co*co));
    return length(r-p) * sign(p.y-r.y);
}

float recycleLogo(vec2 p) {
    vec2 pref = p;
    vec2 scale = vec2(3.0);
    
    p *= scale;
    mat2 rot1 = Rot(radians(30.0));
    mat2 rot2 = Rot(radians(-30.0));
    mat2 rot3 = Rot(radians(150.0));
    float recycleRectA1 = dBox2d((p+vec2(0.1,0.0))*rot1,vec2(0.08,0.15));
    float recycleRectA2 = dBox2d((p+vec2(-0.1,0.0))*rot2,vec2(0.08,0.15));
    float arrowA = sdTriangle(vec2(0.15,0.0),vec2(-0.15,0.0),vec2(0.0,0.11),(p+vec2(-0.18,0.13))*rot3);
    float recycleRectA = min(arrowA,max((p.y-0.1),min(recycleRectA1,recycleRectA2)));
    
    p += vec2(0.28,0.5);
    p *= Rot(radians(-120.0));
    float recycleRectB1 = dBox2d((p+vec2(0.1,0.0))*rot1,vec2(0.08,0.15));
    float recycleRectB2 = dBox2d((p+vec2(-0.1,0.0))*rot2,vec2(0.08,0.15));
    float arrowB = sdTriangle(vec2(0.15,0.0),vec2(-0.15,0.0),vec2(0.0,0.11),(p+vec2(-0.18,0.13))*rot3);
    float recycleRectB = min(arrowB,max((p.y-0.1),min(recycleRectB1,recycleRectB2)));
    p = pref;
    
    p *= scale;
    p += vec2(-0.28,0.5);
    p *= Rot(radians(120.0));
    float recycleRectC1 = dBox2d((p+vec2(0.1,0.0))*rot1,vec2(0.08,0.15));
    float recycleRectC2 = dBox2d((p+vec2(-0.1,0.0))*rot2,vec2(0.08,0.15));
    float arrowC = sdTriangle(vec2(0.15,0.0),vec2(-0.15,0.0),vec2(0.0,0.11),(p+vec2(-0.18,0.13))*rot3);
    float recycleRectC = min(arrowC,max((p.y-0.1),min(recycleRectC1,recycleRectC2)));
    p = pref;
    
    return min(min(recycleRectA,recycleRectB),recycleRectC);
}

float plasticLogo(vec2 p) {
    vec2 pref = p;
    vec2 scale = vec2(2.4);
    
    p *= scale;
    
    mat2 rot1 = Rot(radians(180.0));
    float rectA1 = dBox2d((p+vec2(0.25,0.0)),vec2(0.05,0.1));
    float rectA2 = dBox2d((p+vec2(0.0,-0.05)),vec2(0.2,0.05));
    float rectA3 = dBox2d((p+vec2(-0.25,-0.03)),vec2(0.05,0.07));
    float arrowA = sdTriangle(vec2(0.09,0.0),vec2(-0.09,0.0),vec2(0.0,0.1),(p+vec2(-0.25,0.03))*rot1);
    float prectA = min(arrowA,min(min(rectA1,rectA2),rectA3));
    
    float rectB1 = dBox2d((p+vec2(0.25,0.4)),vec2(0.05,0.15));
    float rectB2 = dBox2d((p+vec2(0.0,0.5)),vec2(0.2,0.05));
    float rectB3 = dBox2d((p+vec2(-0.25,0.48)),vec2(0.05,0.07));
    float arrowB = sdTriangle(vec2(0.09,0.0),vec2(-0.09,0.0),vec2(0.0,0.1),(p+vec2(0.25,0.25)));
    float prectB = min(arrowB,min(min(rectB1,rectB2),rectB3));
    
    mat2 rot2 = Rot(radians(30.0));
    float r1 = length(p+vec2(-0.05,0.2))-0.03;
    float r2 = length(p+vec2(-0.05,0.2))-0.07;
    float r = max(-r1,r2);
    float b =  dBox2d((p+vec2(0.0,0.25)),vec2(0.08,0.025));
    float b1 =  dBox2d((p+vec2(-0.04,0.31))*rot2,vec2(0.025,0.08));
    float charA = min(min(r,b),b1);
    
    float b2 =  dBox2d((p+vec2(-0.25,0.18)),vec2(0.06,0.02));
    float b3 =  dBox2d((p+vec2(-0.29,0.31))*rot2,vec2(0.025,0.08));
    float b4 =  dBox2d((p+vec2(-0.26,0.25)),vec2(0.09,0.025));
    float charB = max(p.x-0.34,min(min(b2,b3),b4));
    
    return min(min(min(prectA,prectB),charA),charB);
}

float paperLogo(vec2 p) {
    vec2 pref = p;
    vec2 scale = vec2(1.6);
    
    p *= scale;
    
    p *= Rot(radians(45.0)+iTime*0.5);
    mat2 rot1 = Rot(radians(90.0));
    float e = sdEllipse(p,vec2(0.27,0.32));
    float e2 = sdEllipse(p,vec2(0.22,0.27));
    float b =  dBox2d((p),vec2(0.06,0.5));
    float arrowA = sdTriangle(vec2(0.09,0.0),vec2(-0.09,0.0),vec2(0.0,0.1),(p+vec2(0.08,-0.28))*rot1);
    float arrowB = sdTriangle(vec2(0.09,0.0),vec2(-0.09,0.0),vec2(0.0,0.1),(p+vec2(-0.08,0.28))*rot1*-1.0);
    float res = min(min(max(-b,max(-e2,e)),arrowA),arrowB);
    p = pref;
    
    p *= scale;
    vec2 pos = vec2(0.02,0.0);
    float b1 = dBox2d((p+vec2(0.07,-0.095)+pos)*Rot(radians(35.0)),vec2(0.015,0.05));
    float b2 = dBox2d((p+vec2(0.03,-0.04)+pos)*Rot(radians(35.0)),vec2(0.015,0.05));
    float b3 = dBox2d((p+vec2(0.07,-0.02)+pos)*Rot(radians(-30.0)),vec2(0.015,0.05));
    float b4 = dBox2d((p+vec2(0.055,0.02)+pos),vec2(0.06,0.015));
    float b5 = dBox2d((p+vec2(0.055,0.07)+pos),vec2(0.015,0.06));
    float b6 = dBox2d((p+vec2(0.11,0.09)+pos)*Rot(radians(20.0)),vec2(0.012,0.03));
    float b7 = dBox2d((p+vec2(0.00,0.09)+pos)*Rot(radians(-20.0)),vec2(0.012,0.03));
    res = min(res,min(b1,min(b2,min(b3,min(b4,min(b5,min(b6,b7)))))));
    
    float b8 = dBox2d((p+vec2(-0.10,-0.12)+pos)*Rot(radians(70.0)),vec2(0.012,0.06));
    float b9 = dBox2d((p+vec2(-0.05,0.01)+pos),vec2(0.012,0.11));
    float b10 = dBox2d((p+vec2(-0.10,0.0)+pos),vec2(0.06,0.012));
    float b11 = dBox2d((p+vec2(-0.13,-0.01)+pos),vec2(0.012,0.13));
    float b12 = dBox2d((p+vec2(-0.06,0.11)+pos)*Rot(radians(-5.0)),vec2(0.038,0.012));
    float b13 = dBox2d((p+vec2(-0.15,0.10)+pos)*Rot(radians(-45.0)),vec2(0.03,0.013));
    
    res = min(res,min(b8,min(b9,min(b10,min(b11,min(b12,b13))))));
    
    return res;
}

float pvcLogo(vec2 p) {
    vec2 pref = p;
    vec2 scale = vec2(2.2);
    
    p *= scale;
    p *= Rot(iTime*-0.6);
    float c1 = length(p)-0.3;
    float c2 = length(p)-0.27;
    float b = dBox2d((p)*Rot(radians(45.0)),vec2(0.02,0.3));
    float res = min(max(-c2,c1),b);
    return res;
}

float outLine(vec2 p) {
    vec2 pref = p;
    float b =  sdBox(p,vec2(1.4,0.8));
    float b2 =  sdBox(p,vec2(1.5,0.9));
    float res = max(-b2,b);
    return res-0.11;
}

float outLine2(vec2 p){
    vec2 pref = p;
    float l0 = sdLine(p,vec2(-0.65,-0.3),vec2(-0.5,0.15));
    float l1 = sdLine(p,vec2(0.65,-0.3),vec2(0.5,0.15));
    float l2 = sdLine(p,vec2(0.5,0.15),vec2(-0.5,0.15));
    float res = min(min(l0,l1),l2);
    return res-0.03;
}

float mixTape(vec2 p) {
    vec2 pref = p;
    
    float mrgX = 0.3;
    
    // M
    vec2 apos = vec2(0.0,sin(iTime*2.0)*0.02);
    float m0 =  sdLine(p+apos,vec2(-1.15+mrgX,0.1),vec2(-1.1+mrgX,0.35));
    float m1 =  sdLine(p+apos,vec2(-1.05+mrgX,0.15),vec2(-1.1+mrgX,0.35));
    float m2 =  sdLine(p+apos,vec2(-1.0+mrgX,0.35),vec2(-1.05+mrgX,0.15));
    float m3 =  sdLine(p+apos,vec2(-0.93+mrgX,-0.05),vec2(-1.0+mrgX,0.35));
    float m = min(min(min(m0,m1),m2),m3);
    
    // I
    apos = vec2(0.0,sin(iTime*3.0)*0.02);
    float i = sdLine(p+apos,vec2(-0.85+mrgX,0.15),vec2(-0.86+mrgX,0.3));
    
    // X
    apos = vec2(0.0,sin(iTime*3.5)*0.02);
    float x0 = sdLine(p+apos,vec2(-0.73+mrgX,0.15),vec2(-0.6+mrgX,0.35));
    float x1 = sdLine(p+apos,vec2(-0.73+mrgX,0.3),vec2(-0.6+mrgX,0.15));
    float x = min(x0,x1);
    
    // T
    apos = vec2(0.0,sin(iTime*3.2)*0.02);
    float t0 = sdLine(p+apos,vec2(-0.53+mrgX,0.25),vec2(-0.32+mrgX,0.3));
    float t1 = sdLine(p+apos,vec2(-0.45+mrgX,0.35),vec2(-0.43+mrgX,0.1));
    float t = min(t0,t1);
    
    // A
    apos = vec2(0.0,sin(iTime*2.9)*0.02);
    float a0 = sdLine(p+apos,vec2(-0.3+mrgX,0.05),vec2(-0.2+mrgX,0.37));
    float a1 = sdLine(p+apos,vec2(-0.1+mrgX,0.05),vec2(-0.2+mrgX,0.37));
    float a2 = sdLine(p+apos,vec2(-0.15+mrgX,0.17),vec2(-0.25+mrgX,0.15));
    float a = min(min(a0,a1),a2);
    
    // P
    apos = vec2(0.0,sin(iTime*3.1)*0.02);
    mat2 rot = Rot(radians(-10.0));
    float pp0 = sdLine(p+apos,vec2(0.02+mrgX,0.1),vec2(0.0+mrgX,0.37));
    float pp1 = sdEllipse((p+apos+vec2(-0.05-mrgX,-0.27))*rot,vec2(0.15,0.06));
    float pp2 = sdEllipse((p+apos+vec2(-0.05-mrgX,-0.27))*rot,vec2(0.14,0.05));
    float pp3 = sdEllipse((p+apos+vec2(0.15-mrgX,-0.27))*Rot(radians(-40.0)),vec2(0.13,0.3));
    float pp = min(pp0,max(-pp3,max(-pp2,pp1)));
    
    // E
    apos = vec2(0.0,sin(iTime*3.5)*0.02);
    float e0 = sdLine(p+apos,vec2(0.3+mrgX,0.33),vec2(0.45+mrgX,0.37));
    float e1 = sdLine(p+apos,vec2(0.27+mrgX,0.22),vec2(0.45+mrgX,0.27));
    float e2 = sdLine(p+apos,vec2(0.2+mrgX,0.1),vec2(0.45+mrgX,0.17));
    float e = min(min(e0,e1),e2);
    
    vec2 scale = vec2(1.0-(sin(iTime*2.3)*cos(iTime*2.3))*0.05);
    p*= scale;
    
    // //1
    float bsl0 = sdLine(p,vec2(-1.25+mrgX,0.3),vec2(-1.27+mrgX,0.4));
    float bsl1 = sdLine(p,vec2(-1.19+mrgX,0.33),vec2(-1.21+mrgX,0.4));
    float bsl = min(bsl0,bsl1)+0.009;
    
    // //2
    float bsr0 = sdLine(p,vec2(1.25+mrgX-0.68,0.27),vec2(1.25+mrgX-0.6,0.35));
    float bsr1 = sdLine(p,vec2(1.19+mrgX-0.65,0.33),vec2(1.21+mrgX-0.6,0.4));
    float bsr = min(bsr0,bsr1)+0.009;
    
    float res = min(min(min(min(min(min(min(min(m,i),x),t),a),pp),e),bsl),bsr);
    
    return res-0.025;
}

float yellowCircle(vec2 p) {
    vec2 pref = p;
    
    mat2 r = Rot(radians(45.0)+iTime*0.8);
    vec2 left = vec2(0.78,0.0);
    float cl0 = length((p+left)*r)-0.2;
    float cl1 = length((p+left)*r)-0.15;
    float cl2 = sdLine((p+left)*r,vec2(-0.18,0.17),vec2(-0.05,0.17))-0.026;
    float cl = min(max(-cl1,cl0),cl2);
    
    vec2 right = vec2(-0.78,0.0);
    float cr0 = length((p+right)*r)-0.2;
    float cr1 = length((p+right)*r)-0.15;
    float cr2 = sdLine((p+right)*r,vec2(-0.15,0.17),vec2(-0.05,0.17))-0.026;
    float cr = min(max(-cr1,cr0),cr2);
    
    float c = min(cl,cr);
    return c;
}

float rsx(vec2 p) {
    vec2 pref = p;
    
    p.y = abs(p.y);
    p.y -= 0.17+sin(iTime*5.0)*0.01;
    
    float outl0 = sdLine(p,vec2(-0.4,0.0),vec2(0.4,0.0))-0.026;
    p = pref;
    
    p.x = abs(p.x);
    p.x -= 0.35+sin(iTime*5.0)*0.01;
    float outl1 = sdLine(p,vec2(0.0,-0.22),vec2(0.0,0.22))-0.026;
    p = pref;
    float outl = min(outl0,outl1);
    
    // R
    float r0 =  sdLine(p,vec2(-0.25,-0.08),vec2(-0.25,0.08))-0.02;
    float r1 =  sdEllipse(p+vec2(0.24,-0.04),vec2(0.1,0.06));
    float r2 =  sdEllipse(p+vec2(0.24,-0.04),vec2(0.07,0.03));
    float r3 =  sdLine(p,vec2(-0.25,0.0),vec2(-0.15,-0.08))-0.02;
    float r = min(min(r0,max(-p.x-0.24,max(-r2,r1))),r3);
    
    // S
    mat2 rot = Rot(radians(30.0));
    p*=rot;
    p.y+=0.025;
    float s0 = sdEllipse(p+vec2(0.04,-0.038),vec2(0.09,0.055));
    float s1 = sdEllipse(p+vec2(0.04,-0.038),vec2(0.05,0.025));
    float s2 = sdEllipse(p+vec2(0.05,0.042),vec2(0.09,0.055));
    float s3 = sdEllipse(p+vec2(0.05,0.042),vec2(0.05,0.025));
    float s = min(max(p.x+0.05,max(-s1,s0)),max(-p.x-0.05,max(-s3,s2)));
    p = pref;
    
    // -
    float bar = sdLine(p,vec2(0.06,0.00),vec2(0.09,0.00))-0.02;
    
    // X
    float x0 = sdLine(p,vec2(0.15,-0.06),vec2(0.25,0.06))-0.02;
    float x1 = sdLine(p,vec2(0.25,-0.08),vec2(0.15,0.08))-0.02;
    float x = min(x0,x1);
    
    vec2 scale = vec2(1.0-(sin(iTime*2.0)*cos(iTime*2.0))*0.03);
    p*= scale;
    
    // //1
    float bsl0 = sdLine(p,vec2(-1.02,0.2),vec2(-1.07,0.1))-0.015;
    float bsl1 = sdLine(p,vec2(-1.09,0.2),vec2(-1.12,0.15))-0.015;
    float bsl = min(bsl0,bsl1);
    
    // //2
    float bsr0 = sdLine(p,vec2(0.92,0.21),vec2(1.0,0.16))-0.015;
    float bsr1 = sdLine(p,vec2(0.96,0.26),vec2(1.01,0.23))-0.015;
    float bsr = min(bsr0,bsr1);
    
    // //3 
    float bsr2 = sdLine(p,vec2(0.9,-0.3),vec2(1.02,-0.24))-0.015;
    
    float res = min(min(min(min(min(min(min(outl,r),s),bar),x),bsl),bsr),bsr2);
    
    return res;
}

float sideA(vec2 p) {
    vec2 pref = p;
    
    vec2 scale = vec2(0.5);
    
    p*=scale;
    
    float b0 =  dBox2d(p+vec2(0.0,-0.05),vec2(0.05,0.02));
    float b1 =  dBox2d(p+vec2(0.0,0.05),vec2(0.08,0.02));
    
    p.x = abs(p.x);
    p.x -= 0.12;
    mat2 rot = Rot(radians(-20.0));
    float b2 =  dBox2d((p+vec2(0.06,0.02))*rot,vec2(0.02,0.12));
    p = pref;
    
    p*=scale;
    float res = max(p.y-0.07,max(-p.y-0.12,min(min(b0,b1),b2)));
    return res;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = surfacePosition*2.0;//(2.0*fragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);
    vec2 pref = p;
    
    // bg color
    vec3 col = vec3(0.0);
    
    float doutLine = outLine(p);
    float doutLine2 = outLine2(p+vec2(0.0,0.55));
    float dmixTape = mixTape(p+vec2(-0.03,-0.3));
    float dyellowCircle = yellowCircle(p+vec2(0.0,0.05));
    float drsx = rsx(p);
    float dsideA = sideA(p+vec2(1.01,0.5));
    float dsideAMask = max(p.y+0.3+abs(sin(iTime*0.7)*0.5),sideA(p+vec2(1.01,0.5)));
    float drLogo = recycleLogo(p+vec2(-0.35,0.51));
    float dpLogo = plasticLogo(p+vec2(0.0,0.52));
    float dpaLogo = paperLogo(p+vec2(-1.0,0.55));
    float dpvcLogo = pvcLogo(p+vec2(0.33,0.61));
    
    // outline
    col = mix( col, vec3(0.8,0.2,0.2), 1.0-smoothstep(0.0,0.007,doutLine) );
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.007,doutLine2) );
    
    // mixtape
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.007,dmixTape) );
    
    // yellow circle
    col = mix( col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0,0.007,dyellowCircle) );
    
    // rs-x
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.007,drsx) );
    
    // side A
    col = mix( col, vec3(0.0,0.0,1.0), 1.0-smoothstep(0.0,0.007,dsideA) );
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.007,dsideAMask) );
    
    // informations
    col = mix( col, vec3(0.0,0.5,0.3), 1.0-smoothstep(0.0,0.01,drLogo) );
    col = mix( col, vec3(0.0,0.5,0.3), 1.0-smoothstep(0.0,0.01,dpLogo) );
    col = mix( col, vec3(0.0,0.5,0.3), 1.0-smoothstep(0.0,0.01,dpaLogo) );
    col = mix( col, vec3(0.0,0.5,0.3), 1.0-smoothstep(0.0,0.01,dpvcLogo) );
        
    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}