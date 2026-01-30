
/*
 * Original shader from: https://www.shadertoy.com/view/td3cW7
 */
// bendy box babay
#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
float jizz=0.;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //


#define PI 3.1415926
#define TAU (2.*PI)
// Adapted mix() for functions that range in [-1,1]
#define smix(a,b,x) mix(a,b,0.5+0.5*(x))
#define ROT(t) mat2(cos(t), sin(t), -sin(t), cos(t))

float dot2( in vec3 v ) { return dot(v,v); }

float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
	vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - r;
}


float sdRoundCone( in vec3 p, in float r1, float r2, float h )
{
    vec2 q = vec2( length(p.xz), p.y );
    
    float b = (r1-r2)/h;
    float a = sqrt(1.0-b*b);
    float k = dot(q,vec2(-b,a));
    
    if( k < 0.0 ) return length(q) - r1;
    if( k > a*h ) return length(q-vec2(0.0,h)) - r2;
        
    return dot(q, vec2(a,b) ) - r1;
}

float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2)
{
    // sampling independent computations (only depend on shape)
    vec3  ba = b - a;
    float l2 = dot(ba,ba);
    float rr = r1 - r2;
    float a2 = l2 - rr*rr;
    float il2 = 1.0/l2;
    
    // sampling dependant computations
    vec3 pa = p - a;
    float y = dot(pa,ba);
    float z = y - l2;
    float x2 = dot2( pa*l2 - ba*y );
    float y2 = y*y*l2;
    float z2 = z*z*l2;

    // single square root!
    float k = sign(rr)*rr*rr*x2;
    if( sign(z)*a2*z2 > k ) return  sqrt(x2 + z2)        *il2 - r2;
    if( sign(y)*a2*y2 < k ) return  sqrt(x2 + y2)        *il2 - r1;
                            return (sqrt(x2*a2*il2)+y*rr)*il2 - r1;
}



float smin(float a, float b, float k)
{
	//float km = sin(jizz*1.5+iTime*1.1)*0.7;
    //k += clamp(km,0.0,0.2);
    float h = clamp(1.-abs((b-a)/k), 0., 2.);
    return min(a,b) - k*0.25*h*h*step(-1.,-h);
}
float smax(float a, float b, float k)
{
    float h = clamp(1.-abs((b-a)/k), 0., 2.);
    return max(a,b) + k*0.25*h*h*step(-1.,-h);
}

float gain(float x, float d)
{
    return (1.-pow(1.-abs(x), d)) * sign(x);
}



float halfMan( vec3 p, float t )
{
    
    float d;
    
    // Torso

    // Re-modeled, and with animation
    vec3 hip = vec3(-0.01-0.02*sin(PI*t),-0.095,-0.27); // Rocking hip
    d = sdRoundCone(p, vec3(0.02, -0.07,-0.1), hip, 0.08, 0.10);
    float srad = 0.1*smoothstep(0.,0.1,0.095-0.5*p.x);
    vec3 shoulder = vec3(-0.02+0.01*sin(PI*t+PI/4.), -0.08, 0.15); // Rocking shoulder
    d = smin(d, sdRoundCone(p, vec3(0.02, -0.07,-0.02), shoulder, 0.085, 0.125), srad);


    // Femur
    float th2M = TAU/12., th2m = -TAU*13./360.; // Min/max angles
    float th2 = smix(th2M,th2m,sin(PI*t)); // Femur oscillation is sinusoidal
    float femurL = 0.46;
    //vec3 q = p - vec3(0., -0.11, -0.275);
    vec3 q = p - hip;
    q.xz *= ROT(th2);
    q.yz *= ROT(0.07); // Femur points "inwards" a bit
    q.z += femurL;
    d = smin(d, sdRoundCone(q.xzy, 0.06, 0.095, 0.4), 0.03);
    
    // Tibia
    float th1M = -0.01, th1m = -TAU/6.;
    // Tibia oscillation is... complicated.
    // It is delayed by PI/4 relative to the femur, and stays around
    // extreme values more.
    float th1 = mix(th1M,th1m,pow(0.5+0.5*sin(PI*t-TAU/4.),2.));
    float tibiaL = 0.355;
    q.y += 0.005;
    q.xz *= mat2(cos(th1), sin(th1), -sin(th1), cos(th1));
    q.yz *= ROT(-0.05);
    q.z += tibiaL;
    d = smin(d, sdRoundCone(q.xzy, 0.041, 0.055, 0.31), 0.02);
    
    // Foot
    // Foot motion is real complicated.
    // When set on the ground, it must be horizontal.
    float th0set=-th1-th2; 
    // When lifted, it is first pointing "down" a lot,
    // then pointing "up" a bit.
    float th0relax=0.5*th1+0.1; 
    // Mix them based on whether the foot is on the ground.
    float th0 = smix(th0set, th0relax, gain(sin(PI*t-TAU/3.), 3.0));
    vec3 foot = vec3(0.25,0.11,0.035);
    q.xz *= mat2(cos(th0),sin(th0),-sin(th0),cos(th0));
    q.z += 0.065;
    q.x -= 0.05;
    d = smin(d, sdBox(q,0.5*foot-0.02)-0.02, 0.1);
    
    // Upper arm
    q = p - vec3(-0.03+shoulder.x, -0.19, 0.215);
    float uarmL = 0.305;
    float th3 = 0.3*sin(PI*t); // Oscillates opposite of the femur
    q.xz *= mat2(cos(th3), sin(th3), -sin(th3), cos(th3));
    q.yz *= ROT(-0.25);
    q.z += uarmL;
    srad = clamp(0.8*(p.z-0.16)-0.3*(p.x+0.05), 0., 0.1);
    d = smin(d, sdRoundCone(q.xzy, 0.045, 0.07, uarmL), srad);
    
    // Lower arm
    float larmL = 0.254;
    float th4 = 0.15+0.15*sin(PI*t-PI/6.); // Delayed w.r.t. upper arm
    q.xz *= ROT(th4);
    q.yz *= ROT(0.15);
    q.z += larmL;
    d = smin(d, sdRoundCone(q.xzy, 0.03, 0.045, 0.21), 0.02);
    
    // Hand
    float phi5 = PI/6.;
    q.xz *= ROT(0.1+0.1*sin(PI*t-PI/4.)); // Delayed still a bit more
    q.xy *= ROT(phi5);
    q.z += 0.08;
    q.y += 0.008;
    d = smin(d, sdBox(q, vec3(0.04, 0.02,0.08)-0.02)-0.025, 0.0);
    d = smin(d, sdRoundCone(q, vec3(0.02,0.005,0.06), vec3(0.05,0.04,-0.03),0.025,0.01), srad);
    
    // Neck bottom
    d = smin(d, sdRoundCone(p, vec3(-0.04,-0.165,0.275), vec3(-0.02,0.05,0.32), 0.01,0.02), 0.05);
    
    return d;
}

float fullMan( vec3 p, float t )
{
	//p.x -= 1.5;
	//p.x = mod(p.x,3.0)-1.5;
	
    // Vertical bobbing of the whole body
    p.z -= 0.03*sin(TAU*t+PI/6.);
    
    // SDF cheat: don't evaluate the complicated sdf if we're too far
    float d0 = sdBox(p, vec3(0.7,0.5,1.2));
    if(d0 > 0.5) return d0-0.25;
    
    // Join the two halves, with a half-cycle of time offset between the two
    float srad = smoothstep(0.,1.,10.0*(0.3+p.z)+3.*p.x)*0.1 + 0.01;
    float d = smin(halfMan(p,t), halfMan(vec3(p.x,-p.y,p.z), t+1.), srad);
    
    // Neck
    d = smin(d, sdRoundCone(p, vec3(-0.04,0.,0.275), vec3(0.0,0.,0.38),0.06,0.06), 0.05);
    
    // Head
    vec3 q = p;
    q.z -= 0.35;
    q.xy *= ROT(gain(cos(0.4*t), 2.)); // Just lookin' around...
    q.xz *= ROT(-0.3-0.1*sin(TAU*t+PI/4.)); // and bobbin' my head...
    q.z += 0.35;
    q = vec3(q.x,abs(q.y),q.z);
    float d2 = smin(
        sdRoundCone(q, vec3(0.,0.,0.50), vec3(0.08,   0.0,0.38),0.1,0.04),
        length(q-vec3(0.02,0.035,0.45))-0.05,
        0.04
    );
    // Eye orbit
    d2 = smax(d2, 0.01-length(q-vec3(0.1,0.05,0.46)), 0.055);
    // Nose
    d2 = smin(d2, length(q-vec3(0.11,0.,0.435)) - 0.01, 0.04);
    
    d = smin(d,d2,0.05);
    return d;     
}

float map( vec3 p )
{
    jizz = p.z*0.6;
    float d = 3.5-length(p);
	d = smin(p.z+1.13,d,1.0);
    float t = 1.5*iTime;
	
	p.yx*=ROT(sin(fract(t*0.131)*6.28+p.z*.4)*3.141);
	
    float d3 = fullMan(p, t);
	
	float d2 = sdBox(p,vec3(0.3,0.3,0.8))-0.2;
	
	//float d2 = length(p)-1.0;
		//d2 = sdCylinder(p,vec2(0.2,0.8));
	//d2 = sdCapsule(p,vec3(0.0,0.0,-0.1),vec3(0.0,0.0,0.1),0.1);
	//dd2 = p.z+1.13;
	d2 = mix (d3,d2,-0.1+sin(fract(iTime*0.1)*6.28)*.125);
	
	d = min(d,d2);
    return d;
}



vec3 normal( vec3 p )
{
    vec2 e = 0.0005 * vec2(1, -1);
    return normalize(
          e.xxx * map(p+e.xxx)
        + e.xyy * map(p+e.xyy)
        + e.yxy * map(p+e.yxy)
        + e.yyx * map(p+e.yyx)
    );
}

// Ambient Occlusion computation adapted from iq
// https://www.shadertoy.com/view/Xds3zN
float calcAO( in vec3 pos, in vec3 nor, float scale )
{
	float occ = 0.0;
	
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float h = 0.01 + scale*0.12*float(i)/4.0;
        float d = map( pos + h*nor );
        occ += (h-d)/scale*sca;
        sca *= 0.95;
        if( occ>0.5 ) break;
    }
    return clamp( 1.0 - 2.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.z);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (2.0*fragCoord - iResolution.xy)/iResolution.y;
    float th = 0.0;//iTime * 0.1;
    vec3 ro = vec3(2.5*cos(th), 2.5*sin(th), 0.0);
    //vec3 ro = vec3(0.,-2.5,0.);
    vec3 camFwd = normalize(vec3(0.5,0,0) - ro);
    vec3 camRight = normalize(cross(camFwd, vec3(0,0,1)));
    vec3 camUp = cross(camRight, camFwd);
    float fov = 0.5;
    vec3 rd = (camFwd + fov * (uv.x * camRight + uv.y * camUp));
    rd = normalize(rd);
    
    float d, t=0.;
    for(int i=0; i<100; i++)
    {
        d = map(ro+t*rd);
        if(d < 0.001 || t > 100.) break;
        t += d;
    }
    vec3 p = ro+t*rd;
    vec3 col;
    if(t > 100.)
    {
        col = 0.5+0.5*rd;
    }
    else
    {
	    
            vec3 pos = ro + t*rd;
 	    vec3 nor = normal(p);
            
            vec3 dir = normalize(vec3(1.0,0.7,0.0));
	        vec3 ref = reflect(rd, nor);
	        float spe = max(dot(ref, dir), 0.0);
	        vec3 spec = vec3(1.0) * pow(spe, 20.);
            float dif = clamp( dot(nor,dir), 0.15, 1.0 );
            col =  vec3(0.3)*dif;
            col+=spec;
        float sca = clamp(length(p), 1.0, 10.0);
        col *= calcAO(p,nor,sca);
    }
    
    
    col *= smoothstep(3.5,1.0,length(uv));
    
    col = pow(col, vec3(1./2.2));
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}