/*
 * Original shader from: https://www.shadertoy.com/view/3lc3zS
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
float sdSphere(vec2 p, float radius)
{    
    return length(p) - radius;
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

float sdLine( in vec2 p, in vec2 a, in vec2 b, float thinness)
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1. );
    return thinness*length( pa - ba*h );
}

float sdVesica(vec2 p, float r, float d)
{
    p = abs(p);
    float b = sqrt(r*r-d*d);
    return ((p.y-b)*d>p.x*b) ? length(p-vec2(0.0,b))
                             : length(p-vec2(-d,0.0))-r;
}

float sdfLine(vec2 p0, vec2 p1, float width, vec2 coord)
{
    vec2 dir0 = p1 - p0;
	vec2 dir1 = coord - p0;
	float h = clamp(dot(dir0, dir1)/dot(dir0, dir0), 0.0, 1.0);
	return (length(dir1 - dir0 * h) - width * 0.5);
}

float sdfUnion( const float a, const float b )
{
    return min(a, b);
}

float sdfDifference( const float a, const float b)
{
    return max(a, -b);
}

float sdfIntersection( const float a, const float b )
{
    return max(a, b);
}

float sdTriangleIsosceles(in vec2 p, in vec2 q )
{
    p.x = abs(p.x);
    vec2 a = p - q*clamp( dot(p,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = p - q*vec2( clamp( p.x/q.x, 0.0, 1.0 ), 1.0 );
    float s = -sign( q.y );
    vec2 d = min( vec2( dot(a,a), s*(p.x*q.y-p.y*q.x) ),
                  vec2( dot(b,b), s*(p.y-q.y)  ));
    return -sqrt(d.x)*sign(d.y);
}

vec2 rot( in vec2 p, float theta)
{
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s,
                s, c)*p;
}

vec4 render(float d, vec3 color, float stroke)
{
    //stroke = fwidth(d) * 2.0;
    float anti = fwidth(d) * 1.0;
    vec4 strokeLayer = vec4(vec3(0.05), 1.0-smoothstep(-anti, anti, d - stroke));
    vec4 colorLayer = vec4(color, 1.0-smoothstep(-anti, anti, d));

    if (stroke < 0.000001) {
    	return colorLayer;
    }
    return vec4(mix(strokeLayer.rgb, colorLayer.rgb, colorLayer.a), strokeLayer.a);
}

vec4 blockRender(float d, vec3 color, float stroke)
{
    
    //stroke = fwidth(d) * 2.0;
    float anti = fwidth(d) * 1.0;
    vec4 colorLayer = vec4(color, 1.0-smoothstep(-anti, anti, d));

    if (stroke < 0.000001) {
    	return colorLayer;
    }
    return colorLayer;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float sdTri( in vec2 p )
{
    p.y = -p.y;
    const float k = sqrt(3.);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y) - .2;
}
 
#define CHS 0.18
 
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float LR(vec2 p, float d){p.x=abs(p.x);return line2(d,p,vec4(2,-3.25,2,3.25)*CHS);}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float C(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float D(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,-1,2,1)*CHS);p.y=abs(p.y);d=line2(d,p,vec4(2,1,1.5,2.75)*CHS);d=line2(d,p,vec4(1.5,2.75,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-2,3.25)*CHS);} // SUCK MY ARSEHOLE
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float F(vec2 p,float d){d=line2(d,p,vec4(2,3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float G(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,2.25,2,3.25)*CHS);d=line2(d,p,vec4(2,-3.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,0.5,-0.25)*CHS);}
float H(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float J(vec2 p,float d){d=line2(d,p,vec4(-1.5,-3.25,0,-3.25)*CHS);d=line2(d,p,vec4(0,-3.25,1,-2.25)*CHS);d=line2(d,p,vec4(1,-2.25,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-1.5,3.25)*CHS);}
float K(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,-0.25,-0.5,-0.25)*CHS);d=line2(d,p,vec4(2,3.25,-0.5,-0.25)*CHS);return line2(d,p,vec4(-0.5,-0.25,2,-3.25)*CHS);}
float L(vec2 p,float d){d=line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float M(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,0.75,2,3.25)*CHS);}
float N(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float P(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d,abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float Q(vec2 p,float d){d=TBLR(p,d);return line2(d,p,vec4(2,-3.25,0.5,-1.75)*CHS);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float S(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-0.25)*CHS);d=line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,2,-3.25)*CHS);}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float U(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);}
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}
float W(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,-1.25,2,-3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float Y(vec2 p,float d){d=line2(d,p,vec4(0,-0.25,0,-3.25)*CHS);p.x=abs(p.x);return line2(d,p,vec4(0,-0.25,2,3.25)*CHS);}
float Z(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
 
float GetText(vec2 uv)
{
	float t = time;
	uv*=6.+sin(t)*0.25;
	uv.x += 1.2;
	uv.y -= 1.7;
	float d = T(uv,1.0);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = G(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;	
	d = R(uv,d);uv.x -= 1.1;	
	uv.x += 5.5;
	uv.y += 1.8;
	d = B(uv,d);uv.x -= 1.1;
	d = U(uv,d);uv.x -= 1.1;
	d = S(uv,d);uv.x -= 1.1;
	d = H(uv,d);uv.x -= 2.2;
	uv.x += 5.5;
	uv.y += 1.8;
	d = B(uv,d);uv.x -= 1.1;
	d = U(uv,d);uv.x -= 1.1;
	d = S(uv,d);uv.x -= 1.1;
	d = H(uv,d);uv.x -= 1.1;
	return smoothstep(0.,0.025,d-0.55*CHS);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float size = min(iResolution.x, iResolution.y);
    float pixSize = 1.0 / size;
	vec2 Ouv = fragCoord.xy / iResolution.x;
	Ouv.y+=cos(time+Ouv.x*1.2)*0.05;
	Ouv.x+=sin(time+Ouv.y*11.2)*0.05;
    float stroke = pixSize * 1.5;
    vec2 center = vec2(0.5, 0.5 * iResolution.y/iResolution.x);
    
    vec2 uv = Ouv;
    uv.x = center.x - abs(uv.x - center.x);
    
    //head
    float face = sdEllipse(uv - center, vec2(0.275 - 0.003*sin(iTime), 0.15));
    float ears = sdVesica(rot(uv - vec2(center), 0.1*sin(sin(iTime))) + vec2(0.13, 0.0), 0.28, 0.15);
    
    float earsInner = sdVesica(rot(uv - vec2(center), 0.1*sin(sin(iTime))) + vec2(0.13, 0.0), 0.27, 0.16);
    earsInner = max(earsInner,-sdEllipse(uv - center, vec2(0.275 - 0.003*sin(iTime), 0.15)));
    earsInner = max(-(uv.y - center.y), earsInner);


    ears = max(-(uv.y - center.y), ears);
    float d = min(ears, face);

    
    //black of face
    float eye = sdEllipse(rot(uv - center, -0.5 + 0.05*sin(iTime)) + vec2(0.14, 0.05), vec2(0.035, 0.045));
    // mouth
    float bF = min(eye, sdLine(rot(uv - center, -0.1*sin(iTime)) - vec2(0., 0.03 - 0.015*sin(iTime)), vec2(0.1, -0.02), vec2(-.015, -0.08),  2.2));

    //whiskers
    for (int i = 0; i<3; i++){
        
    	bF = min(bF, sdLine(rot(rot(uv, -length(uv) + 0.35 - 0.02*sin(iTime)) - center, -float(i)*0.1), vec2(-0.26, -0.05), vec2(-.35, -0.1),  10.*length(uv-center)));
    
    }

    float eyeSpec = sdSphere(rot(uv - center, -0.25 + 0.06*sin(iTime)) + vec2(0.138, -0.009), 0.02);

    //nose
    float nose = sdTri(70.*(uv - center - vec2(0., 0.008 -0.005*sin(iTime))));

    vec4 layer0 = render(d, vec3(0.504, 0.498, 0.378), stroke);

    vec4 layer0_5 = blockRender(earsInner, 0.8*vec3(0.504, 0.498, 0.378), stroke);

    //eye black
    vec4 layer1 = render(bF, vec3(0.), stroke);
    //eye spec
    vec4 layer2 = blockRender(eyeSpec, vec3(1.), stroke);

    //itty bitty kitty nose
    vec4 layer3 = blockRender(nose, vec3(.9, .65, 0.6), stroke);

    //BG KITTIES
    //uv.x = center.x - abs(uv.x - center.x);

    //vec2 bUV = vec2(length(Ouv - center), abs(0.5*atan((Ouv.x - center.x)/(Ouv.y - center.y))));

    vec2 bUV = Ouv;

    float rep = 0.06;
    bUV = mod(bUV + rep, 2.*rep) - rep;
    bUV.x = -abs(bUV.x);

    float sz = 0.1;

    float bgHead = sdEllipse(bUV, vec2(0.05, 0.03));
    float bgEars = sdTri(50.*rot(bUV, 1.4) + vec2(-1.0, -1.7));

    float bgKitty = min(bgEars, bgHead);

    bgKitty = max(bgKitty, -sdSphere(bUV+ vec2(0.025, -.007), 0.007));
    bgKitty = max(bgKitty, -sdTri(200.*(bUV)));

    vec4 bg = 1.3*vec4(0.8, 0.5, .6, 0.);
    vec4 bgKitties = blockRender(bgKitty, 0.94*bg.rgb, stroke);

    fragColor.rgb = mix(bg.xyz, bgKitties.rgb, bgKitties.a);

    fragColor.rgb = mix(fragColor.xyz, layer0.rgb, layer0.a);
    fragColor.rgb = mix(fragColor.rgb, layer0_5.rgb, layer0_5.a);
    fragColor.rgb = mix(fragColor.rgb, layer1.rgb, layer1.a);
    fragColor.rgb = mix(fragColor.rgb, layer2.rgb, layer2.a);
    fragColor.rgb = mix(fragColor.rgb, layer2.rgb, layer2.a);
    fragColor.rgb = mix(fragColor.rgb, layer3.rgb, layer3.a);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
	
	vec2 p = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
	float xd = GetText(p);
	float xd2 = GetText(p-vec2(-0.025,0.025));
	vec3 cc = gl_FragColor.xyz;
	vec3 cc2 = mix(cc*0.15,cc,xd);
	cc = mix(cc*2.25+(sin(p.x*3.0+p.y*10.0+time*3.3)*0.25),cc2,xd2);
	float rf = sqrt(dot(p, p)) * .75;
	float rf2_1 = rf * rf + 1.0;
	float e = 1.0 / (rf2_1 * rf2_1);	
	gl_FragColor  = vec4( cc.rgb*e,1.0);
	
	
    gl_FragColor.a = 1.0;
}