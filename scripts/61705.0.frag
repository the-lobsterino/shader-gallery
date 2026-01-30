/*
 * Original shader from: https://www.shadertoy.com/view/MlKXRh
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

// --------[ Original ShaderToy begins here ]---------- //
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// a perspective correct triangle rasterizer, in a shader!! :D

#define t iTime

mat4 setRotation( float x, float y, float z )
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
mat4 RotationAxisAngle( vec3 v, float angle )
{
    float s = sin( angle );
    float c = cos( angle );
    float ic = 1.0 - c;

    return mat4( v.x*v.x*ic + c,     v.y*v.x*ic - s*v.z, v.z*v.x*ic + s*v.y, 0.0,
                 v.x*v.y*ic + s*v.z, v.y*v.y*ic + c,     v.z*v.y*ic - s*v.x, 0.0,
                 v.x*v.z*ic - s*v.y, v.y*v.z*ic + s*v.x, v.z*v.z*ic + c,     0.0,
			     0.0,                0.0,                0.0,                1.0 );
}

mat4 setTranslation( float x, float y, float z )
{
    return mat4( 1.0, 0.0, 0.0, 0.0,
				 0.0, 1.0, 0.0, 0.0,
				 0.0, 0.0, 1.0, 0.0,
				 x,     y,   z, 1.0 );
}

struct Triangle
{
    vec3 a; vec2 aUV;
    vec3 b; vec2 bUV;
    vec3 c; vec2 cUV;
    vec3 n;
};


Triangle triangles[4];

void createCube( void )
{
    vec3 verts[8];

    verts[0] = vec3( -1.0, -1.0, -0.0 );
    verts[1] = vec3( -1.0, -1.0,  0.0 );
    verts[2] = vec3( -1.0,  1.0, -0.0 );
    verts[3] = vec3( -1.0,  1.0,  0.0 );
    verts[4] = vec3(  1.0, -1.0, -0.0 );
    verts[5] = vec3(  1.0, -1.0,  0.0 );
    verts[6] = vec3(  1.0,  1.0, -0.0 );
    verts[7] = vec3(  1.0,  1.0,  0.0 );

    triangles[0].a = verts[1]; triangles[0].aUV = vec2(0.0,0.0);
    triangles[0].b = verts[5]; triangles[0].bUV = vec2(1.0,0.0);
    triangles[0].c = verts[7]; triangles[0].cUV = vec2(1.0,1.0);
    triangles[0].n = vec3( 0.0, 0.0, 0.0 );
    triangles[1].a = verts[1]; triangles[1].aUV = vec2(0.0,0.0),
    triangles[1].b = verts[7]; triangles[1].bUV = vec2(1.0,1.0),
    triangles[1].c = verts[3]; triangles[1].cUV = vec2(0.0,1.0),
    triangles[1].n = vec3( 0.0, 0.0, 0.0 );

    triangles[2].a = verts[5]; triangles[2].aUV = vec2(0.0,0.0);
    triangles[2].b = verts[4]; triangles[2].bUV = vec2(1.0,0.0);
    triangles[2].c = verts[6]; triangles[2].cUV = vec2(1.0,1.0);
    triangles[2].n = vec3( 0.0, 0.0, 0.0 );
    triangles[3].a = verts[5]; triangles[3].aUV = vec2(0.0,0.0);
    triangles[3].b = verts[6]; triangles[3].bUV = vec2(1.0,1.0);
    triangles[3].c = verts[7]; triangles[3].cUV = vec2(0.0,1.0);
    triangles[3].n = vec3( 0.0, 0.0, 0.0 );

     
}

float crosse( vec2 a, vec2 b )
{
    return a.x*b.y - a.y*b.x;
}

vec3 lig = normalize( vec3( 0.3,0.7,0.5) );

vec4 bg = vec4(1.,0.,0.,0.0);
 
vec4 l( in vec2 p, in vec2 a, in vec2 b,in float t,in vec4 c )
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float d = length( pa - ba*h );
    
    return smoothstep(t/iResolution.y, 0., d ) * c;
}



vec3 pixelShader( in vec3 nor, in vec2 p, in float z, in vec3 wnor )
{
    vec4 cl = vec4(0);
    p *= 2.0;
    p.y = p.y-0.5;
    
    vec4 tcol=vec4(p,sin(t),1.0);
    
    float lh=8.0;
    // S  5 segments 
  	cl += l(p-vec2(.1,0.6),vec2(0.0,0.0),vec2(.0,-.15),lh,tcol);
    cl += l(p-vec2(.1,0.6),vec2(0.0,0.0),vec2(.15,0.0),lh,tcol);
    cl += l(p-vec2(.1,0.45),vec2(0.0,0.0),vec2(.15,0.0),lh,tcol);
    cl += l(p-vec2(.25,0.45),vec2(0.0,0.0),vec2(.0,-.17),lh,tcol);
    cl += l(p-vec2(.1,0.28),vec2(0.0,0.0),vec2(.15,0.0),lh,tcol);
       
    // H 
    cl += l(p-vec2(0.3,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    cl += l(p-vec2(0.30,0.45),vec2(0.0,0.0),vec2(.15,.00),lh,tcol);
    cl += l(p-vec2(0.45,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    // A
    cl += l(p-vec2(.60,0.6),vec2(0.0,0.0),vec2(-.1,-.32),lh,tcol);
    cl += l(p-vec2(.60,0.6),vec2(0.0,0.0),vec2(.1,-.32),lh,tcol);
    // D
    cl += l(p-vec2(0.75,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    cl += l(p-vec2(0.75,0.6),vec2(0.0,0.0),vec2(.15,-.16),lh,tcol);
    cl += l(p-vec2(0.75,0.28),vec2(0.0,0.0),vec2(.15,0.16),lh,tcol);
     // E
    cl += l(p-vec2(0.95,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    cl += l(p-vec2(0.95,0.45),vec2(0.0,0.0),vec2(.15,.00),lh,tcol);
    cl += l(p-vec2(0.95,0.6),vec2(0.0,0.0),vec2(.15,.00),lh,tcol);
    cl += l(p-vec2(0.95,0.28),vec2(0.0,0.0),vec2(.15,.00),lh,tcol);
    // R    
    cl += l(p-vec2(1.15,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    cl += l(p-vec2(1.15,0.6),vec2(0.0,0.0),vec2(.15,0.0),lh,tcol);
    cl += l(p-vec2(1.15,0.45),vec2(0.0,0.0),vec2(.15,0.0),lh,tcol);
    cl += l(p-vec2(1.30,0.6),vec2(0.0,0.0),vec2(.0,-.15),lh,tcol);
    cl += l(p-vec2(1.15,0.45),vec2(0.0,0.0),vec2(.15,-0.17),lh,tcol);
    // T
    cl += l(p-vec2(1.45,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    cl += l(p-vec2(1.35,0.6),vec2(0.0,0.0),vec2(.20,.00),lh,tcol);
    // O
    
    cl += l(p-vec2(1.60,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    cl += l(p-vec2(1.60,0.6),vec2(0.0,0.0),vec2(.15,0.0),lh,tcol);
    cl += l(p-vec2(1.60,0.28),vec2(0.0,0.0),vec2(.15,0.0),lh,tcol);
    cl += l(p-vec2(1.75,0.6),vec2(0.0,0.0),vec2(.0,-.32),lh,tcol);
    //yy
    
    cl += l(p-vec2(1.80,0.6),vec2(0.0,0.0),vec2(.10,-.16),lh,tcol);
    cl += l(p-vec2(1.90,0.44),vec2(0.0,0.0),vec2(.10,.16),lh,tcol);
    cl += l(p-vec2(1.9,0.45),vec2(0.0,0.0),vec2(.0,-.17),lh,tcol);
    
 
    return vec3(cl.xyz);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	mat4 mdv = setTranslation( 0.0, 0.0, -1.5 ) * 
		       setRotation( t*3.,t*2. , 0. )*
               RotationAxisAngle(vec3(0.0,0.0,0.0), 0.2 );
 
    vec2 px = fragCoord / iResolution.xy*2.-1.;
    
    px.x *=iResolution.x/iResolution.y;
    

   createCube();
	 
    float scl =mod(fragCoord.y,3.0);
    
    vec3 color = vec3( 0.0, 0.0, 0.0 );

 
        // transform to eye space
        vec3 ep0 = (mdv * vec4(triangles[1].a,1.0)).xyz;
        vec3 ep1 = (mdv * vec4(triangles[1].b,1.0)).xyz;
        vec3 ep2 = (mdv * vec4(triangles[1].c,1.0)).xyz;
        vec3 nor = (mdv * vec4(triangles[1].n,0.0)).xyz;

        // transform to clip space
        float w0 = 1.0/ep0.z;
        float w1 = 1.0/ep1.z;
        float w2 = 1.0/ep2.z;

        vec2 cp0 = 2.0*ep0.xy * -w0;
        vec2 cp1 = 2.0*ep1.xy * -w1;
        vec2 cp2 = 2.0*ep2.xy * -w2;

        // fetch vertex attributes, and divide by z
        vec2 u0 = triangles[1].aUV * w0;
        vec2 u1 = triangles[1].bUV * w1;
        vec2 u2 = triangles[1].cUV * w2;
 
        vec3 di = vec3( crosse( cp1 - cp0, px - cp0 ), 
					    crosse( cp2 - cp1, px - cp1 ), 
					    crosse( cp0 - cp2, px - cp2 ) );
		
  
            // calc barycentric coordinates
            vec3 ba = di.yzx / (di.x+di.y+di.z);

            // barycentric interpolation of attributes and 1/z
            float iz = ba.x*w0 + ba.y*w1 + ba.z*w2;
            vec2  uv = ba.x*u0 + ba.y*u1 + ba.z*u2;

            // recover interpolated attributes
            float z = 1.0/iz;
            uv *= z;
 
   			 color = pixelShader( nor, uv, z, triangles[1].n );
    
    fragColor = vec4(color,1.0)*scl;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}