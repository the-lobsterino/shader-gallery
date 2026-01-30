/*
 * Original shader from: https://www.shadertoy.com/view/Wscyz2
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
// SST Squelcher

#define AA 1	// make this 2 if you are feeling cold...
#define HEIGHT 12.

vec3 _col;



// prim
float sdCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
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
float sminCol( float a, float b, float k, vec3 col1, vec3 col2 )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
    _col = mix(col1,col2,h);// -  k*h*(1.0-h);
	return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 erot(vec3 p, vec3 ax, float ro)
{
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

float WaveletNoise(vec3 p, float z, float k) {
    // https://www.shadertoy.com/view/wsBfzK
    float d=0.0,s=2.,m=0., a;
    for(float i=0.; i<15.; i++) {
        vec3 q = p*s, g=fract(floor(q)*vec3(123.34,233.53,314.15));
    	g += dot(g, g+23.234);
		a = fract(g.x*g.y)*1e3 +z*(mod(g.x+g.y, 2.)-1.); // add vorticity
        q = (fract(q)-.5);
        q = erot(q, normalize(tan(g+.1)), a);
        d += sin(q.x*4.+z)*smoothstep(.25, .0, dot(q,q))/s;
        p = erot(p,normalize(vec3(-1,1,0)),atan(sqrt(2.)))+i; //rotate along the magic angle
        m += 1./s;
        s *= k; 
    }
    float v = clamp(d/m,-1.0,1.0);
	return v;
}
  
float map( in vec3 pos )
{
    // testing 'wavelet' noise...
    float nx = WaveletNoise(pos*0.1+vec3(0.0,iTime,0.0), iTime*3., 1.15)*1.9;
    float nz = WaveletNoise(pos*0.1+vec3(0.0,iTime,0.0) + 10.0, iTime*3., 1.15)*1.9;
    vec3 p2 = pos;
    p2.x += nx;
    p2.z += nz;
    float d1 = sdCylinder(p2,vec2(4.0,HEIGHT))-1.0;
    d1 = smax(d1-sin(iTime*7.0+pos.y*0.15)*2.5,d1,-3.0);
    
        // sphere cut
        float rad = fract(iTime*0.1)*80.0;
        float rad2 = clamp(rad,0.0,18.0);
	p2.y += nz*0.5;
        float sphere1 = length(p2-vec3(0.0,HEIGHT+4.0-rad,0.0))-rad2;
        float sphere2 = length(p2-vec3(0.0,((HEIGHT*2.0)+HEIGHT+4.0-rad),0.0))-rad2;	//rad;
        sphere1 = min(sphere1,sphere2);
        d1 = smax(d1,sphere1,4.0);
	float cmod = 0.5+sin(nx*1.3-nz*2.0)*0.5;
	
    _col = vec3(0.55,0.45,0.05)*1.2;
    vec3 _col2 = vec3(0.19,0.42,0.07)*1.3;
    _col = mix(_col2,_col,cmod);
    pos.y = abs(pos.y);
    vec3 p = pos;
    
    d1*=0.85;
	p.y += nz*0.4;
    
    float d2 = sdCylinder(p-vec3(0.0,HEIGHT+2.0,0.0),vec2(12.5,0.3))-1.4;
    d1 = sminCol(d2,d1,5.0,_col,vec3(0.45,0.05,0.04));
    return d1;
}

vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.05;	//0.0005
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}
    
#define PI 3.14159
#define	TAU 6.28318

vec3 cocks(vec2 p)
{
	p.x = 0.5-abs(p.x-0.5);
	p = sin(p*.6).yx;
	p.x += sin(time*1.1+p.y*3.0)*0.07;
	float v = p.x * (1.0 - p.x) / p.y * (1.5+sin(sin(time*0.45+p.x*17.)+time*2.1)- p.y);
	v +=sin(time*0.6+p.x*15.8);
	vec3 col = vec3(v*0.15,v*0.34,v*0.13)*sin((0.1+p.x*p.y)*4.8);
	return col*.137;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     // camera movement	
    float an = sin(iTime*0.8);
    
    //float dist = 36.0+sin(iTime)*7.0;
    float dist = 28.0;
    
	vec3 ro = vec3( dist*cos(an), sin(iTime*0.75)*14.0, dist*sin(an) );
	//vec3 ro = vec3( 16.0*cos(an), 0.0, 16.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    vec3 tot = vec3(0.0);
	    vec2 ppp = (-iResolution.xy + 2.*(fragCoord))/iResolution.y;

	vec3 bbk = cocks( gl_FragCoord.xy / resolution.xy );
	

    
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
        const float tmax = 65.0;
        float t = 0.0;
        for( int i=0; i<160; i++ )
        {
            vec3 pos = ro + t*rd;
            float h = map(pos);
            if( h<0.0001 || t>tmax ) break;
            t += h;
        }
    
        // shading/lighting	
        float v = 1.0-abs(p.y);
        vec3 col = bbk*v*2.0;	//vec3(v*0.1);

        if( t<tmax )
        {
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            
            vec3 dir = normalize(vec3(1.0,0.7,0.0));
	        vec3 ref = reflect(rd, nor);
	        float spe = max(dot(ref, dir), 0.0);
	        vec3 spec = vec3(1.0) * pow(spe, 40.);
            float dif = clamp( dot(nor,dir), 0.05, 1.0 );
            col =  _col*dif;
            col+=spec;
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