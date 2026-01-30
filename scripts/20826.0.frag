// Simple combination of two things by @dennishjorth.
// I thought it would be sorta cool, 

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 iMouse =vec3(mouse,-1.0);

// "Seascape" by Alexander Alekseev aka TDM - 2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Mahmud Yuldashev ocean

const int NUM_STEPS = 8;
const float PI	 	= 3.1415;
const float EPSILON	= 1e-3;
float EPSILON_NRM	= 0.1 / resolution.x;

float sdSegment( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a;
    vec3 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1. );	
    return length( pa - ba*h ) - r;
}

const float slab = 0.05;


vec3 mapSlab( vec3 pos ) 
{
    float an = 2.0*sin( 0.5*time - 0.5*length(pos) );
    float co = cos(an);
    float si = sin(an);
    mat2 gRot = mat2( co, -si, si, co );
    
    pos.xz = gRot*pos.xz;
    
    pos.x -= 0.4*sin(0.5*time);
    
    float rad = length(pos);
    float the = atan(pos.x,pos.z)+3.1416;
    float kid = floor(the/6.2831/slab);
    float phi = acos(pos.y/rad) + 3.0*kid;
    
    vec2 id = floor( vec2(the,phi)/6.2831/slab );

    the = mod( the/6.2831, slab ) - slab*0.5;
    phi = mod( phi/6.2831, slab ) - slab*0.5;

    float anph = dot(id,vec2(3171.15,2317.34));
    the += rad*0.002*cos(-rad*8.0 + 2.0*time + anph);
    phi += rad*0.002*sin(-rad*8.0 + 2.0*time + anph);
    
    float len =      1.50 * (0.7+0.3*sin(dot(id,vec2(1213.15,1317.34))));
    float thi = slab*0.25 * (0.6+0.4*sin(2.0*3.14*rad/len));

    
    float d = sdSegment( vec3(the*8.0,phi*8.0,rad), 
                         vec3(0.0,0.0,0.0), 
                         vec3(0.0,0.0,len), thi*8.0 )/8.0;
    
    return vec3( d, rad/len, dot(id,vec2(217.2,311.3)) );
}

vec3 calcNormal( in vec3 pos )
{
    const vec2 e = vec2(1.0,-1.0)*0.001;

    return normalize( e.xyy*mapSlab( pos + e.xyy ).x + 
					  e.yyx*mapSlab( pos + e.yyx ).x + 
					  e.yxy*mapSlab( pos + e.yxy ).x + 
					  e.xxx*mapSlab( pos + e.xxx ).x );
}

vec3 intersect( in vec3 ro, in vec3 rd, float tmin, float tmax )
{
float t = tmin;
float g = 0.0;
float m = 0.0;

for( int i=0; i<200; i++ ) 
{
vec3 pos = ro + t*rd;
vec3 d = mapSlab(pos);
g = d.y;
m = d.z;
if( d.x < (0.001*t) || t>tmax ) 
{ 
break;
}

t += d.x;
}

if( t>tmax ) t = -1.0;

return vec3( t, g, m );
}

vec2 iSphere( in vec3 ro, in vec3 rd, in vec4 sph )
{
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return vec2(-1.0);
    h = sqrt(h);
	return vec2( -b - h, -b + h );
}




// sea
const int ITER_GEOMETRY = 2;
const int ITER_FRAGMENT = 2;
const float SEA_HEIGHT = 0.6;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 0.8;
const float SEA_FREQ = 0.16;
const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
const vec3 SEA_WATER_COLOR = vec3(1.0,0.9,0.9);
const float SKY_INTENSITY = 1.0;
float SEA_TIME = time * SEA_SPEED;

// math
mat4 fromEuler(vec3 ang) {
	vec2 a1 = vec2(sin(ang.x),cos(ang.x));
    vec2 a2 = vec2(sin(ang.y),cos(ang.y));
    vec2 a3 = vec2(sin(ang.z),cos(ang.z));
    mat4 m;
    m[0] = vec4(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x,0.0);
	m[1] = vec4(-a2.y*a1.x,a1.y*a2.y,a2.x,0.0);
	m[2] = vec4(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y,0.0);
	m[3] = vec4(0.0,0.0,0.0,1.0);
	return m;
}
vec3 rotate(vec3 v, mat4 m) {
    return vec3(dot(v,m[0].xyz),dot(v,m[1].xyz),dot(v,m[2].xyz));
}
float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}


// lighting
float diffuse(vec3 n,vec3 l,float p) { return pow(dot(n,l) * 0.4 + 0.6,p); }
float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

// sky
vec3 sky_color(vec3 e) {
    e.y = max(e.y,0.0);
    vec3 ret;
    ret.x = pow(1.0-e.y,2.0);
    ret.y = 1.0-e.y;
    ret.z = 0.6+(1.0-e.y)*0.4;
    return ret * SKY_INTENSITY;
}

// sea
float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);        
    vec2 wv = 1.0-abs(sin(uv));
    vec2 swv = abs(cos(uv));    
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}

float map(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    mat2 m = mat2(1.6,1.2,-1.2,1.6);
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_GEOMETRY; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}
float map_detailed(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    mat2 m = mat2(1.6,1.2,-1.2,1.6);
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_FRAGMENT; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

vec3 sea_color(in vec3 p, in vec3 n, in vec3 eye, in vec3 dist) {  
    float fresnel_o = 1.0 - max(dot(n,-eye),0.0);
    float fresnel = pow(fresnel_o,3.0) * 0.65;
        
    // reflection
    vec3 refl = sky_color(reflect(eye,n));
    
    // color
    vec3 ret = SEA_BASE;    
    ret = mix(ret,refl,fresnel);
    
    // wave peaks    
    float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
    ret += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
    
    return ret;
}

// tracing
vec3 getNormal(vec3 p, float eps) {
    vec3 n;
    n.y = map_detailed(p);    
    n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
    n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
    n.y = eps;
    return normalize(n);
}
float hftracing(vec3 ori, vec3 dir, out vec3 p) {  
	ori = vec3(1./(ori.x+1.), 1./ori.y, 1./ori.z);
    float tm = 0.0;
    float tx = 1000.0;    
    float hx = map(ori + dir * tx);
    if(hx > 0.0) return tx;   
    float hm = map(ori + dir * tm);    
    float tmid = 0.0;
    for(int i = 0; i < NUM_STEPS; i++) {
        tmid = mix(tm,tx, hm/(hm-hx));                   
        p = ori + dir * tmid;                   
    	float hmid = map(p);
		if(hmid < 0.0) {
        	tx = tmid;
            hx = hmid;
        } else {
            tm = tmid;
            hm = hmid;
        }
    }
    return tmid;
}

// main
void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;    
    float time = time * 0.3;
        
    // ray
    vec3 ang = vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);
    if(iMouse.z > 0.0) ang = vec3(0.0,clamp(2.0-iMouse.y*0.01,-0.3,PI),iMouse.x*0.01);
	mat4 rot = fromEuler(ang);
    
    vec3 ori = vec3(0.0,3.5,time*5.0);
    vec3 dir = normalize(vec3(uv.xy,-2.0));
    dir.z += length(uv) * 0.15;
    dir = rotate(normalize(dir),rot);
    
    // tracing
    vec3 p;
    float dens = hftracing(ori,dir,p);
    vec3 dist = p - ori;
    vec3 n = getNormal(p, dot(dist,dist)*EPSILON_NRM);
             
    // color
    vec3 color = sea_color(p,n,dir,dist);
    vec3 light = normalize(vec3(0.0,1.0,0.8));  
    color += vec3(diffuse(n,light,80.0) * SEA_WATER_COLOR) * 0.12; 
    color += vec3(specular(n,light,dir,60.0));  
    
    // post
    color = mix(sky_color(dir),color,pow(smoothstep(0.0,-0.05,dir.y),0.3)); 
    color = pow(color,vec3(0.75));
	gl_FragColor = vec4(color,1.0);
	
    vec2 p2 = (-resolution.xy+2.0*gl_FragCoord.xy)/resolution.y;
    vec2  q = gl_FragCoord.xy/resolution.xy;
    vec3 ta = vec3(-0.9,0.0,0.0);
    vec3 ro = vec3(-0.9,0.0,2.5);        
    vec3  ww = normalize( ta - ro);
    vec3  uu = normalize( cross( normalize(vec3(0.2+cos(time*0.1),1.0+sin(time*0.1),0.0)), ww ) );
    vec3  vv = normalize( cross(ww,uu) );
    vec3  rd = normalize( p2.x*uu + p2.y*vv + 2.0*ww );
	
    vec3 col = color;
	
    vec2 sp = iSphere( ro, rd, vec4(0.0,0.0,0.0,1.7) );
    if( sp.y>0.0 )
    {
        vec3 res = intersect( ro, rd, max(sp.x,0.0), sp.y );

        if( res.x > 0.5) // 3. - sin(time) )
        {
            float t = res.x+6.95;
            float m = res.z;
            float g = res.y;
            vec3  pos = ro + t*rd;
            vec3  nor = calcNormal( pos );
            float id = 0.5 + 0.5*sin(m);

            col = 0.5 + 0.5*cos( 0.0 + id*6.2831*0.3 + vec3(0.0,1.0,1.5) );
            col += vec3(0.4,0.2,0.1)*smoothstep(0.9,1.0,g);
            col *= 0.17;
            col *= 0.05 + 0.95*smoothstep( -2.9, 0.0, smoothstep(0.9,1.0,g)+sin( 1.0 + g*30.0  ) );
            col *= 0.5 + 0.5*nor.y;
            col += col*vec3(3.0,2.0,1.0)*clamp(1.0+dot(rd,nor),0.0,1.0);
            col *= g*g*g;
	    col /= nor;
        }
    }
    
    col = pow( col, vec3(0.4545) );
    
    col *= vec3(1.0,1.2,1.4);
    
    col *= pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
    
    gl_FragColor = vec4( col, 1.0 );
	
}