/*
 * Original shader from: https://www.shadertoy.com/view/ll3XRr
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
const float HALFPI = acos(0.0);
const float PI = HALFPI * 2.0;
const float TWOPI = HALFPI * 4.0;

// IQ's functions ----------------------------------------------------------------------

float opI( float d1, float d2 )
{
    return max(d1,d2);
}

float opS( float d1, float d2 )
{
    return max(-d2, d1);
}

vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x < d2.x) ? d1 : d2;
}

vec3 opRep( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}

// Distance functions ----------------------------------------------------------------------

vec2 rot(vec2 pos, float ang)
{
    return vec2(cos(ang) * pos.x + sin(ang)*pos.y, cos(ang) * pos.y - sin(ang)*pos.x);
}   

float findDistG1(in vec2 p)
{
    p = rot(vec2(p.x, -p.y), -0.05);
    float d1 = length(max(abs(p)-vec2(0.2, 0.2),0.0))-0.8;
    float d2 = length(max(abs(p - vec2(0.0, 0.03))-vec2(0.15, 0.18),0.0))-0.45;
	vec2 d = abs(vec2(p.x + 3.6 * p.y + 0.05, p.y + 0.72)) - vec2(1.0, 0.6);
	float d3 = min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
	d = abs(p - vec2(0.57, 0.07)) - vec2(0.43, 0.19);
  	float d4 = min(max(d.x, d.y),0.0) + length(max(d,0.0));    
    return min(max(max(d1, -d2), -d3), d4);
}    

float findDistE1(in vec2 p)
{
	p = vec2(p.x, -p.y);
    vec2 d = abs(rot(p, -0.05) - vec2(-0.73, -0.05)) - vec2(0.24, 0.98);
  	float d1 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));
	d = abs(p - vec2(0.05, 0.78)) - vec2(0.95, 0.21);
  	float d2 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));        
	d = abs(p - vec2(0.04, 0.0)) - vec2(0.95, 0.21);
  	float d3 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));        
	d = abs(p - vec2(0.04, -0.74)) - vec2(0.95, 0.26);
  	float d4 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));        
    return min(min(min(d1, d2), d3), d4);
}    

float findDistE2(in vec2 p)
{
	p = vec2(p.x, -p.y);
	vec2 d = abs(rot(p, 0.01) - vec2(-0.73, -0.02)) - vec2(0.24, 0.96);
  	float d1 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));
	d = abs(rot(p, 0.025) - vec2(0.05, 0.76)) - vec2(0.95, 0.20);
  	float d2 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));        
	d = abs(rot(p, 0.02) - vec2(0.02, 0.0)) - vec2(0.95, 0.20);
  	float d3 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));        
	d = abs(rot(p, 0.02) - vec2(0.04, -0.78)) - vec2(0.93, 0.20);
  	float d4 = min(max(d.x, d.y),0.0) + length(max(d, 0.0));        
    return min(min(min(d1, d2), d3), d4);
}    

float findDistG2(in vec2 p)
{
    p = rot(vec2(p.x, -p.y), -0.045);
    float d1 = length(max(abs(p)-vec2(0.35, 0.35),0.0))-0.65;
    float d2 = length(max(abs(p - vec2(0.0, 0.05))-vec2(0.15, 0.11),0.0))-0.45;
	vec2 d = abs(vec2(p.x + 2.0 * p.y - 0.9, p.y + 0.72)) - vec2(1.0, 0.6);
	float d3 = min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
	d = abs(p - vec2(0.55, 0.055)) - vec2(0.45, 0.21);
  	float d4 = min(max(d.x, d.y),0.0) + length(max(d,0.0));    
    return min(max(max(d1, -d2), -d3), d4);
}  

float findDistB(in vec2 p)
{
    vec2 q = rot(vec2(p.x, -p.y), 0.03);
    float d1 = length(max(abs(q-vec2(-0.2, 0.0))-vec2(0.63, 0.85),0.0))-0.15;
    float d2 = length((q-vec2(0.4, 0.4))*vec2(1.0, 1.0)) - 0.6;
    float d3 = length((q-vec2(0.3, -0.412))*vec2(1.0, 1.0)) - 0.6;
    float d4 = length(max(abs(p-vec2(-0.05, 0.4))-vec2(0.08, 0.01),0.0))-0.2;
    float d5 = length(max(abs(p-vec2(-0.05, -0.4))-vec2(0.08, 0.01),0.0))-0.2;
    
    return max(min(min(d1, d2), d3), -min(d4, d5));
}  

vec2 walls (in vec3 pos)
{
    vec3 walls = abs(pos - vec3(-3.6, 4.0, -0.5));
    return vec2(min(min(walls.x, walls.y), walls.z), 1.0);
}   

vec2 upperCube (in vec3 pos)
{
	vec3 cb = pos - vec3(0.0, 0.0, 5.5);
    return vec2(
        opI(
        	opI(
                findDistG2(cb.yz), 
                findDistE2(cb.xz)
            ),
            findDistB(cb.xy)
        ), 2.0);
}

vec2 lowerCube (in vec3 pos)
{
	vec3 cb = pos - vec3(0.0, 0.0, 2.5);
    return vec2(
        opI(
        	opI(
                findDistE1(cb.yz), 
                findDistG1(cb.xz)
            ),
            findDistB(cb.xy)
        ), 3.0);
}


// Material ----------------------------------------------------------------------

vec3 colorWall(in vec3 s, in vec3 n)
{
    float c, cf = 10.0;
    int glyph;
    vec2 uv;
    vec3 gridCol = vec3(0.0);
    if (n.z == 1.0) 
    {
        c = findDistB(vec2(s.x, s.y));
        cf = 5.0;
    }
    else
        if (n.x == 1.0)
        {
            c = s.z < 4.0 ? findDistE1(vec2(s.y, s.z - 2.5)) : findDistG2(vec2(s.y, s.z - 5.5));
        }
        else
        {
            c = s.z < 4.0 ? findDistG1(vec2(s.x, s.z - 2.5)) : findDistE2(vec2(s.x, s.z - 5.5));
        }
    
    c = smoothstep(0.0, 0.15, c);
    float i = abs(dot(normalize(s - vec3(0.0, 0.0, 3.7)), n));
    i = 0.01 + 0.5 * i + pow(i, 10.0);
    float j = max(0.0, 1.0 - 1.0 * pow(distance(s, vec3(-2.0, 2.0, 3.0)) * 0.15, 2.0));
    return j * i * c * vec3(0.9, 0.7, 0.2);
}

vec3 colorLowerCube(in vec3 s, in vec3 n)
{
    // Wood texture
    float f;
    s.z -= 2.5;
    vec2 fx = 0.1 * vec2(cos(s.x * 0.4), sin(s.x * 0.6)) + vec2(15.0, 15.0);
    f = sin(length(s.yz - fx) * 100.0) * 0.2 + 0.5;
    return mix(vec3(0.3, 0.2, 0.0), vec3(0.9, 0.6, 0.0), f);    
}

vec3 colorUpperCube(in vec3 s, in vec3 n)
{
    // Wood texture
    float f;
    s.z -= 5.5;
    vec2 fx = 0.1 * vec2(cos(s.z * 0.4), sin(s.z * 0.3)) + vec2(-5.0, -5.0);
    f = sin(length(s.xy - fx) * 100.0) * 0.2 + 0.5;
    return mix(vec3(0.3, 0.2, 0.0), vec3(0.9, 0.6, 0.0), f);    
}


// Rendering ----------------------------------------------------------------------

vec2 map( in vec3 pos )
{
    vec2 res = walls(pos);
    res = opU(res, upperCube(pos));
    res = opU(res, lowerCube(pos));
    return res;
}

vec2 castRay( in vec3 ro, in vec3 rd )
{
    float tmin = 0.01;
    float tmax = 50.0;
	float precis = 0.0002;
    float t = tmin;
    float m = 1.0;     // material
    for (int i = 0; i < 80; i++)
    {
	    vec2 res = map(ro + rd * t);
        if (res.x < precis || t > tmax) break;
        t += abs(res.x);
	    m = res.y;
    }
    if (t > tmax) m = -1.0;
    return vec2(t, m);
}

float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i = 0; i < 16; i++ )
    {
		float h = map(ro + rd*t).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h < 0.001 || t > tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.001, 0.000, 0.000 );
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
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 render( in vec3 ro, in vec3 rd )
{ 
    vec3 col, n, light;
    vec2 res = castRay(ro, rd);
    float t = res.x;  // res.x: distance
    float m = res.y;  // res.y: material
    if (m > 0.5)
    {
        vec3 s = ro + t*rd;
        
        // material        
        if (m == 1.0)
        {
        	n = abs(normalize(s - vec3(-3.6, 4.0, -0.5)));
            n = (n.x < min(n.y, n.z)) ? vec3(1.0, 0.0, 0.0) :
            	  n.y < n.z ? vec3(0.0, -1.0, 0.0) :
            	  vec3(0.0, 0.0, 1.0);
                
            return colorWall(s, n);
        }            
        else 
        {
            n = calcNormal(s);
            if (m == 2.0)
            {
                col = colorLowerCube(s, n);
            }
            else
            {
                col = colorUpperCube(s, n);
            }            
            float cc = 0.0, ccc = 0.0;

            for (int lt = 0; lt < 3; lt++)
            {
                // Light position
                light = 
                	lt == 0 ? vec3(5.0, 0.0, 3.7) :
                	lt == 1 ? vec3(0.0, -5.0, 3.7) :
                	vec3(-0.5, 0.0, 10.0);

                // Light vector
                vec3 lvec = normalize(light - s);
                
                float mm = castRay(s, lvec).y;
                float shadow = mm > 1.5 ? 0.2 : 1.0;

                // Mirror vector
                float a = -dot(n, rd);

                
                // lighting intensity
                cc += shadow * max(0.1, dot(n, lvec));

                // specular spot intensity
                ccc += shadow * 0.8 * max(0.0, dot(rd + 2.0 * a * n, lvec));

            }
            vec3 d = vec3((s.x + 0.1) * 2.0, (s.y - 0.1) * 2.0, s.z - (m == 3.0 ? 2.8: 4.0));
            return col * cc + vec3(pow(ccc, 30.0));
        }
    }
}

void calcCamera(in vec2 fragCoord, out vec3 ro, out vec3 rd)
{
    vec2 mx;
    if (iMouse.z > 0.0)
        mx = iMouse.xy / iResolution.xy;
    else
        mx = vec2(0.58, 0.191);
    
    float dst = 35.0;
    
    ro = vec3(
        max(0.1, dst *cos(mx.x * 4.0 - 1.4) * cos(mx.y * 4.0)), 
        min(-0.1, -dst *sin(mx.x * 4.0 - 1.4) * cos(mx.y * 4.0)), 
        max(0.1, (7.0 + dst) * sin(mx.y * 4.0 - 0.5)));
    
    vec3 at = vec3(-0.4, 0.0, 3.1);
    vec3 up = vec3(-0.04, 0.0, 1.0); // Sorry I'm used to a right handed system, z pointing up
    vec3 look = at - ro;
    float dist = length(look);
    float aper = 16.0;  // degrees
    float hsize = tan(aper*PI/180.0)*dist;
    float vsize = hsize * iResolution.y /iResolution.x;
    vec3 hor = normalize(cross(look, up)) * hsize;
    vec3 ver = normalize(cross(hor, look)) * vsize;
    vec2 p = fragCoord/iResolution.xy * 2.0 - 1.0;
    rd = normalize(look + p.x * hor + p.y * ver);
}   


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = 15.0 + iTime;

    vec3 ro, rd;
    calcCamera(fragCoord, ro, rd);
    
    vec3 col = render( ro, rd );
    
    col = pow( col, vec3(0.4545) );
    fragColor = vec4( col.rgb, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}