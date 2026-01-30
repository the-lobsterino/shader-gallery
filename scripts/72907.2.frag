// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;

vec2 hash2(vec2 p)
{
       vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
       p3 += dot(p3, p3.yzx+19.19);
       vec2 o = fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
   return o;
}
vec3 hash3(vec3 p){
	vec2 tmp=hash2(p.xy);
  return vec3(hash2(vec2(tmp.x,p.z)),hash2(vec2(p.z,tmp.y)).x);
}

vec3 voronoi( in vec3 x )
{
    vec3 n = floor(x);
    vec3 f = (x);

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
	vec3 mr;
	vec3 id;

    float md = 8.0;
    for( int k=-1; k<=1; k++ )
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec3 g = vec3(float(i),float(j),float(k));
	vec3 o = hash3( n + g );
        vec3 r = n + g + o - f;
        float d = dot(r,r);

        if( d<md )
        {   id=n+g;
            md = d;
            mr = r;
        }
    }

    //----------------------------------
    // second pass: distance to borders,
    // visits only neighbouring cells
    //----------------------------------
    md = 8.0;
    for( int k=-1; k<=1; k++ )
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec3 g = vec3(float(i),float(j),float(k));
	vec3 o = hash3( id + g );
	vec3 r = id + g + o - f;

        if( dot(mr-r,mr-r)>0.00001) // skip the same cell
        md = min( md, 
		 dot( 0.5*(mr+r), 
		     normalize(r-mr) ) 
		);
    }
	 return vec3( md ); 
}


void main() {
    vec2 st = surfacePosition;//gl_FragCoord.xy/resolution.xy;
//    st.x *= resolution.x/resolution.y;
	st*=5.0;
	float pos=1.0+time*1.1;;
	vec3 vor;
    vec3 color = vec3(0.);
	for(int i=0; i<27;i++){
	vec3 p=vec3(st*(1.0+pos*0.0001),10.0+pos);
	 vec3 p2=vec3(      dot(p,vec3(1.0,1.0,1.0)),
			    dot(p,vec3(-1.0,-1.0,1.0)),
			    dot(p,vec3(1.0,-1.0,-1.0)));
         vor = voronoi(p2);
	 pos+=vor.x*1.1;
	}
    //color*=sin(d*0.1)*0.5+0.6;
	float val=sin((pos-time)*0.51)*0.5+0.5;
    gl_FragColor = vec4(val,val,val,1.0);
}