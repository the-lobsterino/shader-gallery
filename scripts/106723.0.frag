// flying cock
#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable

float lg(vec2 p)
{
    float s = 0.08;
    float sd = rect(p, vec2(0.0), vec2(0.65)*s);
    sd = sub(sd, rect(p, vec2(-0.3, +0.5)*s, vec2(0.2, 0.35)*s));
    sd = sub(sd, rect(p, vec2(+0.3, -0.5)*s, vec2(0.2, 0.35)*s));
    sd = sub(sd, rect(p, vec2(-0.5, -0.3)*s, vec2(0.35, 0.2)*s));
    sd = sub(sd, rect(p, vec2(+0.5, +0.3)*s, vec2(0.35, 0.2)*s));
    return sd;
}

float intersect(float a, float b){return max(a,b);}

float box( vec3 p, vec3 b ){
	vec3  di = abs(p) - b;
	float mc = max(di.x, max(di.y, di.z));
	return min(mc,length(max(di,0.0)));}
float sphere(vec3 p, float r){return lengthtime) ) * 2.5);
    clouds = pow(clouds, vec3(2.));
	vec3 other = vec3(0.2,0.0,0.3);
	float m = clamp(rd.y+0.2,0.0,1.0);
	return mix(other,clouds,m);
}

#define TAU 6.283185

float ground(vec3 p
   objID=2.0;
   if (d<k
   {
       objID=1.0;
       if (d2<d)
           objID=3.0;
   }
   d = min(d2,d);
   return min(d,g);
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
    objID=0.0;
	float zoom = sin(time*0.33)*0.2;
	float an = -1.05+sin(time*0.1)*0.21;
	float y = 0.5+sin(time*0.45)*0.29;
	vec3 ro = vec3( zoom+2.0*cos(an), (0.7-y*0.5)+20.0, zoom+2.5*sin(an) );
    vec3 ta = vec3( 0.0, 20.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    // create view ray
    vec3 rd = normalize( p.x*uu + p.y*vv + 3.5*ww );
    // raymarch
    const float tmax = 490.0;
    float t = 0.0;
    for( int i=0; i<150; i++ )
    {
        vec3 pos = ro + t*rd;
        float h = map(pos);
        if( h<0.0001 || t>tmax ) break;
        t += h;
    }
	float id = objID;
	vec3 objcol = vec3(0.85,0.7,0.7);
	if (id>1.0)
		objcol = vec3(0.13,0.23,1.1);
	if (id>2.0)
		objcol = vec3(0.7+sin(fract(time)*TAU)*0.15,0.04,0.04);
	
    // shading/lighting	
    vec3 background = clouds(rd);
    vec3 col = background;
    if( t<tmax )
    {
		vec3 l = vec3(0.0,1.0,0.0);
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
        float dif = clamp( dot(nor,vec3(0.57703)), 0.0, 1.0 );
        float amb = 0.5 + 0.5*dot(nor,l);
		float spe = pow(clamp(dot(reflect(l, nor), rd), 0.0, 1.0), 16.0);
        col = vec3(0.1,0.1,0.1)*amb + objcol*dif;
		col += spe;
        float m = exp(-0.00001*(t*t));
        col = mix(background,col,m);
    }
    // gamma        
    return sqrt(col);
}

void main()
{
	vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
	vec3 col = render(p);
	float m = step(length(col),0.0);
        float r = clamp(hash12(p+fract(time*0.7))+0.5,0.0,1.0);
        float rr = 0.5+sin(sin(r+time*0.9-p.y*3.14*p.x)+p.x*(1.2+r)+fract(time*0.3-r)*TAU)*0.5;
        col += (rr+0.3)*0.141;
        col -= 0.571 * max( sin(gl_FragCoord.y*0.85 - time * 12.1)-r*0.79, 0.1);
        col *= clamp(mod(gl_FragCoord.x*gl_FragCoord.y, 1.0),0.85,1.0);
    vec2 q = gl_FragCoord.xy/resolution.xy;
    col *= 0.3 + 0.7*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.25);
	gl_FragColor = vec4( col, 1.0 );
}