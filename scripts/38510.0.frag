#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
#define time (time * 10.0)
uniform vec2 mouse;
uniform vec2 resolution;

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

   float t=-dot(ac,e)/det;
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
void main()
{
    createCube();
    
    vec4 color =  vec4(0.3,0.3,0.3,0.1);
    //triangle verts
    vec2 uv = gl_FragCoord.xy/resolution.xy*2.-1.;
    
    uv = fract(8.*uv* sin(time*0.08)-0.1);
    uv =floor(uv*64.)/64.;
    
    //z position of near clipping plane
    float near=0.2;
    vec3 p= vec3(uv*2.0-1.0,near);
    //considering aspect ratio
    p.x *= resolution.x / resolution.y;
    //calc ray direction
    vec3 camera = vec3(0.0,0.0,5.0);
    vec3 dir = p-camera;
	dir = normalize(dir);

    // clear zbuffer
    float mindist = 10000000.0;
    //each triangle in scene
    for(int i=0;i<12;i++){
        vec4 a=triangles[i].a;
        vec4 b=triangles[i].b;
        vec4 c=triangles[i].c;
        mat4 rot = rotate(6.1*cos(0.8*time),3.1*sin(0.8*time),2.1*sin(0.8*time));
        
        vec4 ra = rot*a;
        vec4 rb = rot*b;
        vec4 rc = rot*c;

        vec3 uvt;
        bool isHit =hit(camera,dir,ra.xyz,rb.xyz,rc.xyz,uvt);
        if(isHit)
        {
            vec3 intersect = camera + dir*uvt.z;
            float z = intersect.z;
            // depth  buffer test
			if( z<mindist )
			{
				mindist = z;
                //intersect point in local coordinate by using barycentric coordinate
				vec4 localP = (1.0-uvt.x-uvt.y)*a+uvt.x*b+uvt.y*c;
                //convert -0.5-0.5 to 0.0-1.0
				color = localP+0.5;
			}
        }
    }//end i loop
    gl_FragColor = color;
}