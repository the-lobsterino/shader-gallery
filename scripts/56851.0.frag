#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

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
        col = vec3(0.2,0.3,0.4)*amb + vec3(0.8,0.7,0.5)*dif;
    }

    // gamma        
    col = sqrt( col );
    tot += col;
    return tot;
}

#define S(s,d)  sin( mod(-atan(U.y,U.x) s 3.14, v) d )

vec3 euro( vec2 U )
{
    vec2 tt;
    float v = 2.5;
    U = (U+U -(tt.xy=resolution.xy))/tt.y;
    U*= 0.7;
    float l = ceil( 5.* length( U )-.5 ) / 5.;
    vec3 O = mix( vec3(0,0,.7), vec3(1,.8,0), 
             l==.6 ? smoothstep(.0,.1,
                                -10.*length(U-= l* sin( ceil(1.91*atan(U.y,U.x)-.5)/1.91 + vec2(1.57,0) ))
                                +.3/ min(max(S(+,),S(+,+v)),
                                         max(S(-,),S(-,+v))))
                   : 0. );
	return O;
}

void main( void )
{
	vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
	vec3 col = render(p);
	float m = step(length(col),0.0);
	col = mix(euro(gl_FragCoord.xy), col,1.0-m);
	gl_FragColor = vec4( col, 1.0 );
}