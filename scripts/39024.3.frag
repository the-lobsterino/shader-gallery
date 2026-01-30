#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define M_PI 3.1415926535897932384626433832795

vec2 rand2(vec2 p)
{
    p = vec2(dot(p, vec2(12.9898,78.233)), dot(p, vec2(26.65125, 83.054543))); 
    return fract(sin(p) * 43758.5453);
}

float rand(vec2 p)
{
    return fract(sin(dot(p.xy ,vec2(54.90898,18.233))) * 4337.5453);
}

// Thanks to David Hoskins https://www.shadertoy.com/view/4djGRh
float stars(in vec2 x, float numCells, float size, float br)
{
    vec2 n = x * numCells;
    vec2 f = floor(n);

	float d = 1.0e10;
    for (int i = -1; i <= 1; ++i)
    {
        for (int j = -1; j <= 1; ++j)
        {
            vec2 g = f + vec2(float(i), float(j));
			g = n - g - rand2(mod(g, numCells)) + rand(g);
            // Control size
            g *= 1. / (numCells * size);
			d = min(d, dot(g, g));
        }
    }

    return br * (smoothstep(.95, 1., (1. - sqrt(d))));
}

// @param x....radian around x-axis
// @param y....radian around y-axis
// @param z....radian around z-axis
//from https://www.shadertoy.com/view/XdlGzn
mat4 rotate( float x, float y, float z )
{
    float a = sin(x); float b = cos(x); 
    float c = sin(y); float d = cos(y); 
    float e = sin(z); float f = cos(z); 

    float ac = a*c;
    float bc = b*c;

    return mat4( d*f,      d*e,       -c, 0.0,
                 ac*f-b*e, ac*e+b*f, a*d, 0.0,
                 bc*f+a*e, bc*e-a*f, b*d, 0.0,
                 0.0,      0.0,      0.0, 1.0 );
}
mat4 translate( float x, float y, float z )
{
    return mat4( 1.0, 0.0, 0.0, x,
				 0.0, 1.0, 0.0, y,
				 0.0, 0.0, 1.0, z,
				 0.0, 0.0, 0.0, 1.0 );
}
//from https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/moller-trumbore-ray-triangle-intersection
//ray and triangle hit test
// @param orig...origin of ray
// @param dir...ray direction
// @param a,b,c....triangle vertices
// @return u,v,t
bool hit(vec3 orig,vec3 dir,vec3 a,vec3 b,vec3 c,out vec3 uvt){
   float eps= 0.0000001;
   vec3 ab=b-a;
   vec3 ac=c-a;
   
   vec3 n=cross(dir,ac);

   float det=dot(ab,n);
   // if the determinant is negative the triangle is backfacing
   // if the determinant is close to 0, the ray misses the triangl
   if(det<=eps){ return false;}
   
   vec3 ao=orig-a;
   float u=dot(ao,n)/det;
   if(u<0.0 || u>1.0){ return false;}
    
   vec3 e=cross(ao,ab);
   float v=dot(dir,e)/det;
   if(v<0.0||u+v>1.0){ return false;}

   float t= dot(ac,e)/det;
   uvt = vec3(u,v,t);
   return true;
}
struct Triangle
{
    vec4 a;
    vec4 b;
    vec4 c;
};

Triangle triangles[12];

void createCube( void )
{
    vec4 verts[8];

    float size = 0.5;//size of cube
    verts[0] = vec4( -size, -size, -size ,1.0);
    verts[1] = vec4( -size, -size,  size ,1.0);
    verts[2] = vec4( -size,  size, -size ,1.0);
    verts[3] = vec4( -size,  size,  size ,1.0);
    verts[4] = vec4(  size, -size, -size ,1.0);
    verts[5] = vec4(  size, -size,  size ,1.0);
    verts[6] = vec4(  size,  size, -size ,1.0);
    verts[7] = vec4(  size,  size,  size ,1.0);

    triangles[0].a = verts[1];
    triangles[0].b = verts[5];
    triangles[0].c = verts[7];
    
    triangles[1].a = verts[1]; 
    triangles[1].b = verts[7];
    triangles[1].c = verts[3]; 

    triangles[2].a = verts[5];
    triangles[2].b = verts[4];
    triangles[2].c = verts[6];
    
    triangles[3].a = verts[5];
    triangles[3].b = verts[6];
    triangles[3].c = verts[7];

    triangles[4].a = verts[3];
    triangles[4].b = verts[7];
    triangles[4].c = verts[6];
    
    triangles[5].a = verts[3];
    triangles[5].b = verts[6];
    triangles[5].c = verts[2];

    //back side
    triangles[6].a = verts[0];
    triangles[6].b = verts[6];
    triangles[6].c = verts[4];
    
    triangles[7].a = verts[0];
    triangles[7].b = verts[2];
    triangles[7].c = verts[6];

    //x minus side
    triangles[8].a = verts[1];
    triangles[8].b = verts[2];
    triangles[8].c = verts[0];
    
    triangles[9].a = verts[1];
    triangles[9].b = verts[3];
    triangles[9].c = verts[2];

    
    triangles[10].a = verts[1];
    triangles[10].b = verts[0];
    triangles[10].c = verts[4];
    
    triangles[11].a = verts[1];
    triangles[11].b = verts[4];
    triangles[11].c = verts[5];
}

vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	

	return c.z * mix( vec3(1.0), rgb, c.y);
}


void main()
{
    
	float res  = max(resolution.y, resolution.y);
    
    vec2 coord = gl_FragCoord.xy / resolution;

    vec3 result = vec3(0.);
    result += stars(vec2(coord.x + time * 2.00,coord.y) , 1., 0.10, 2.)  * vec3(.74, .74, .74); 
    result += stars(vec2(coord.x + time * 1.10,coord.y) , 1., 0.10, 2.)  * vec3(.74, .74, .74);
    result += stars(vec2(coord.x + time * 0.8,coord.y) , 1., 0.10, 2.)  * vec3(.74, .74, .74);
    result += stars(vec2(coord.x + time * 0.5,coord.y) , 2., 0.09, 2.) * vec3(.74, .74, .74);
    result += stars(vec2(coord.x + time * 0.2,coord.y) , 4., 0.08, 2.) * vec3(.74, .74, .74);	
    result += stars(vec2(coord.x + time * 0.05,coord.y), 8., 0.05, 1.) * vec3(.74, .74, .74);
    result += stars(vec2(coord.x + time * 0.025,coord.y), 10., 0.05,0.8) * vec3(.95, .95, .95);
    result += stars(coord  , 20., 0.025, 0.5) * vec3(.9, .9, .95);
	
	
//	 gl_FragColor = vec4(result,1.0); 
		
	
	
	
	
	createCube();
    
    vec4 color =  vec4(0.0,0.0,0.05,0.1);
    //triangle verts
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    
    //z position of near clipping plane
    float near=0.2;
    vec3 p= vec3(uv*2.0-1.0,near);
    //considering aspect ratio
    p.x *= resolution.x / resolution.y;
    //calc ray direction
    vec3 camera = vec3(0.0,0.0,-3.0);
    vec3 dir = p-camera;
	dir = normalize(dir);

    // clear zbuffer
    float mindist = -10000000.0;
    //each triangle in scene
    for(int i=0;i<12;i++){
        vec4 a=triangles[i].a;
        vec4 b=triangles[i].b;
        vec4 c=triangles[i].c;
        mat4 rot = rotate(0.0,3.1*sin(0.2*time)*6.28,0.0)*rotate(0.3,0.0,0.0);
        
        vec4 ra = rot*a;
        vec4 rb = rot*b;
        vec4 rc = rot*c;

        vec3 uvt;
        bool isHit = hit(camera,dir,ra.xyz,rb.xyz,rc.xyz,uvt);
        if(isHit)
        {
            vec3 intersect = camera + dir*uvt.z;
            float z = intersect.z;
            // depth  buffer test
			if( z > mindist )
			{
				mindist = z;
                //intersect point in local coordinate by using barycentric coordinate
			//	vec4 localP = (1.0-uvt.x-uvt.y)*a+uvt.x*b+uvt.y*c;
                
               vec4 localP = vec4( hsv2rgb(vec3(5.0*uv.y  , 1.0, 1.0)), 1.0 )*a+uvt.x*b+uvt.y*c;
                
                //convert -0.5-0.5 to 0.0-1.0
				color = localP+0.5;
			}
        }
    }//end i loop
    
	
	if (color.a >0.1) gl_FragColor = vec4(color); 
	else 
	gl_FragColor = vec4(result,1.); 	
        
	
	
    // bar layer open scene ;	
    vec2 bl = gl_FragCoord.xy / resolution.xy;
    
    if(bl.y>.50-min(time/20.,0.4) ^^ bl.y<0.50+min(time/20.0,.4))  gl_FragColor  = vec4(0.3,0.3,0.3,1.0);
    	
	
	
}