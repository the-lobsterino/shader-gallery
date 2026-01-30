/*
 * Original shader from: https://www.shadertoy.com/view/Wstcz7
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// more gloop (brown!)
#define AA 1	// make this 2 if you are feeling cold...
#define HEIGHT 4.

// prim
float sdCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

// min/max polynomial
float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}
float smax(float a, float b, float k)
{
    return smin(a, b, -k);
}

// noise
float noise(vec3 p,float scale, float s1,float s2)
{
    p*=scale;
    float k = dot(sin(p - cos(p.yzx*1.57)), vec3(.333))*s1;
    k += dot(sin(p*2. - cos(p.yzx*3.14)), vec3(.333))*s2;    
    return k*0.4;
}

float pModInterval1(inout float p, float size, float start, float stop) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p+halfsize, size) - halfsize;
	if (c > stop) { //yes, this might not be the best thing numerically.
		p += size*(c - stop);
		c = stop;
	}
	if (c <start) {
		p += size*(c - start);
		c = start;
	}
	return c;
}

float map( in vec3 pos )
{
    vec3 p2 = pos;
    float c2 = pModInterval1(pos.z,5.0,-2.0,2.0);
    pos.x += 0.1*c2;
    float c1 = pModInterval1(pos.x,5.0,-2.0,0.0);
    float d1 = sdCylinder(pos,vec2(0.8,HEIGHT))-0.5;
    float t = iTime*1.1;
    
    float xo = sin(t*.2)*2.0;
    
    
    float n1 = noise(pos+vec3(0.0,t*1.0,0.0),1.0,3.57,.83);
    float n2 = noise(pos+vec3(xo,t*1.5,0.0), 1.5, 4.47, 1.43);
    float n3 = noise(pos+vec3(0.0,t*2.0,0.0), 2.0, 1.87,3.13);
    
    float rnd = (124.6+c1) + (177.5*c2);
    float rnd2 = (126.6+c1) + (9.9*c2);
    rnd2 = 1.0+(abs(sin(rnd2))*0.1);
    
    float v1 = 0.8+sin(rnd+(t*rnd2)+pos.y*0.3);
    n1 = smin(n1,n2,4.);
    n1 = smin(n1,n3,4.);
    n1 *= v1;
  	d1 = smax(n1,d1,4.);
    
    pos=p2;
    pos.y = abs(pos.y);
	float d2 = sdBox(pos-vec3(-5.0,HEIGHT,0.0),vec3(8.,0.25,12.))-0.1;
    d1 = smin(d1,d2,0.8);
    return d1*0.8;
}

vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.008;	//0.0005
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}
    

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     // camera movement	
	//float an = 0.5*(iTime-10.0);
    float an = sin(iTime)*0.5;
	vec3 ro = vec3( 10.0*cos(an), sin(iTime*0.75)*5.0, 10.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    vec3 tot = vec3(0.0);
    
    #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
        #else    
        vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
        #endif

	    // create view ray
        vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

        // raymarch
        const float tmax = 45.0;
        float t = 0.0;
        for( int i=0; i<128; i++ )
        {
            vec3 pos = ro + t*rd;
            float h = map(pos);
            if( h<0.0001 || t>tmax ) break;
            t += h;
        }
        
    
        // shading/lighting	
        float v = 1.0-abs(p.y);
        vec3 col = vec3(v*0.1);

        if( t<tmax )
        {
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            float dif = clamp( dot(nor,vec3(0.57703)), 0.0, 1.0 );
            float amb = 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0));
            col = vec3(0.05,0.05,0.03)*amb + vec3(0.35,0.1,0.05)*dif;
 			col+= pow(dif, 100.);//Observer - fake spec :)
        }

        // gamma        
        col = sqrt( col );
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

	fragColor = vec4( tot, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}