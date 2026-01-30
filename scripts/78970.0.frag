// https://www.shadertoy.com/view/stt
vec2 hash2( vec2 p )
{
    // procedural white noise	
	return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
// Voronoi (IQ) - slightly modified to return get the ID etc.
vec4 VoronoiGrid( in vec2 x, out vec2 id )
{
    vec2 n = floor(x);
    vec2 f = fract(x);

    // first pass: high voronoi
	vec2 mg, mr;

    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 g = vec2(float(i),float(j));
		vec2 o = hash2( n + g );
        vec2 r = g + o - f;
        float d = dot(r,r);
        if( d<md )
        {
            md = d;
            mr = r;
            mg = g;
        }
    }
    
    // second pass: distance to borders
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = mg + vec2(float(i),float(j));
		vec2 o = hash2( n + g );
        vec2 r = g + o - f;

        if( dot(mr-r,mr-r)>0.00001 )
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }
    
    id = (n+mg)+vec2(0.5); // ID is n+mg
    return vec4(md, length(mr), mr);
}

mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
vec2 smoothRot(vec2 p,float s,float m,float c,float d)
{
  s*=0.5;
  float k=length(p);
  float x=asin(sin(atan(p.x,p.y)*s)*(1.0-m))*k;
  float ds=k*s;
  float y=mix(ds,2.0*ds-sqrt(x*x+ds*ds),c);
  return vec2(x/s,y/s-d);
}
vec3 hsv2rgb(vec3 c)
{
  // Íñigo Quílez
  // https://www.shadertoy.com/view/MsS3Wc
  vec3 rgb = clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
  rgb = rgb * rgb * (3. - 2. * rgb);
  return c.z * mix(vec3(1.), rgb, c.y);
}

void main( void )
{
	vec2 pp = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	pp*=rotate(length(pp*0.5)+time*0.1);
	//pp *= 16.;
//	pp.x += sin(pp.y)*0.15;

	pp.yx += sin(abs(pp.x+pp.y)*2.0+time)*0.05;
	
//	pp.y += sin(time+pp.x*3.0)*0.15;
	pp = smoothRot(pp*16.0,32.0,.05,7.,time+pp.x);
	
	
	float t = time*0.5;
	float nt = 0.5+sin(t*.4)*0.5;
	//pp*=0.5*sin(length(dot(pp,pp))+time*0.8);
    	vec2 id;
    	float scale = 2.0+4.0*nt;
    	vec4 grid = VoronoiGrid(pp*scale,id);
	    pp = id/scale;
	
	pp.x += sin(pp.x+pp.y*1.0)*0.4;
	
	
	
	

	vec3 col = hsv2rgb(vec3((length(pp))*0.1,0.65,0.35+abs(sin(time*0.1+pp.x))));
	
	gl_FragColor = vec4( col,1.0 );
}