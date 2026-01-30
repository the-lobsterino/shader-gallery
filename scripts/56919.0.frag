#ifdef GL_ES

precision mediump float;
#endif
//Ashok Gowtham M
//UnderWater Caustic lights
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//normalized sin
float sinn(float x)
{
	return sin(x)/2.+.1;
}

float CausticPatternFn(vec2 pos)
{
	return (sin(pos.x*40.+time)
		+pow(sin(-pos.x*130.+time),1.)
		+pow(sin(pos.x*30.+time),2.)
		+pow(sin(pos.x*50.+time),2.)
		+pow(sin(pos.x*80.+time),2.)
		+pow(sin(pos.x*90.+time),2.)
		+pow(sin(pos.x*12.+time),2.)
		+pow(sin(pos.x*6.+time),2.)
		+pow(sin(-pos.x*13.+time),5.))/2.;
}

vec2 CausticDistortDomainFn(vec2 pos)
{
	pos.x*=(pos.y*0.60+1.);
	pos.x*=1.+sin(time/2.)/10.;
	return pos;
}
float sdCylinder(vec3 p, vec3 a, vec3 b, float r)
{
    vec3  ba = b - a;
    vec3  pa = p - a;
    float baba = dot(ba,ba);
    float paba = dot(pa,ba);
    float x = length(pa*baba-ba*paba) - r*baba;
    float y = abs(paba-baba*0.5)-baba*0.5;
    float x2 = x*x;
    float y2 = y*y*baba;
    
    float d = (max(x,y)<0.0)?-min(x2,y2):(((x>0.0)?x2:0.0)+((y>0.0)?y2:0.0));
    
    return sign(d)*sqrt(abs(d))/baba;
}

float rect(vec2 p, vec2 c, vec2 rad)
{
    vec2 d = abs(p - c) - rad;
    return max(d.x, d.y);
}

float sub(float a, float b)
{
    return max(a, -b);
}

vec2 rot(vec2 v, float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c)*v;
}

float Hitler(vec2 uv)
{
	float sd = rect(uv, vec2(0.0), vec2(0.695));
	sd = sub(sd, rect(uv, vec2(-0.3, +0.4), vec2(0.2, 0.3)));
	sd = sub(sd, rect(uv, vec2(+0.3, -0.4), vec2(0.2, 0.3)));
	sd = sub(sd, rect(uv, vec2(-0.4, -0.3), vec2(0.3, 0.2)));
	sd = sub(sd, rect(uv, vec2(+0.4, +0.3), vec2(0.3, 0.2)));
	return sd;
}

float map( in vec3 pos )
{
    vec2 p = pos.xy;
    p = rot(p,time*0.25+0.5);
    float d = Hitler(p);
    float dep = 0.1;
    vec2 e = vec2( d, abs(pos.z) - dep );
    d = min(max(e.x,e.y),0.0) + length(max(e,0.0));
    return d;
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.0005;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}

vec3 render( vec2 p )
{
    
     // camera movement	
	float an = 0.5*(time-10.0);
	vec3 ro = vec3( 2.0*cos(an), 0.4, 2.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    
    vec3 tot = vec3(0.0);

    // create view ray
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    // raymarch
    const float tmax = 3.0;
    float t = 0.0;
    for( int i=0; i<256; i++ )
    {
        vec3 pos = ro + t*rd;
        float h = map(pos);
        if( h<0.0001 || t>tmax ) break;
        t += h;
    }

    // shading/lighting	
    vec3 col = vec3(0.0);
    if( t<tmax )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
        float dif = clamp( dot(nor,vec3(0.57703)), 0.0, 1.0 );
        float amb = 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0));
        col = vec3(.2,0.3,.4)*amb + vec3(0.8,0.7,0.5)*dif;
    }

    // gamma        
    col = sqrt( col );
    tot += col;
    return tot;
}

#define S(s,d)  sin( mod(-atan(U.y,U.x) s 3.14, v) d )

void main( void ) 
{
	vec2 pos = gl_FragCoord.xy/resolution;
	pos-=.5;
	vec2  CausticDistortedDomain = CausticDistortDomainFn(pos);
	float CausticShape = clamp(7.-length(CausticDistortedDomain.x*20.),0.,1.);
	float CausticPattern = CausticPatternFn(CausticDistortedDomain);
	float Caustic;
	Caustic += CausticShape*CausticPattern;
	Caustic *= (pos.y+.5)/4.;
	float f = length(pos+vec2(-.5,.5))*length(pos+vec2(.5,.5))*(1.+Caustic)/1.;
	vec3 col = vec3(.1,.5,.6)*(f);
	vec3 adolf = render(pos);
	float m = step(length(col),0.0);
	vec3 cull = mix(adolf,col,0.5);
	gl_FragColor = vec4( cull, 1.0 );
	

}