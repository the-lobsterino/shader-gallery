// captain futre 'F'

// gtr 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define lf 15.0 // bold fct

float hash( float n ) { return fract(sin(n)*43758.5453); }

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);

}

float fbm( vec2 p, float sp)
{
    const mat2 m = mat2( 0.8, 0.6, -0.6, 0.8 );

	float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02; p.y -= sp*time;
    f += 0.2500*noise( p ); p = m*p*2.03; p.x -= sp*time;
    f += 0.1250*noise( p ); p = m*p*2.01; p.x += sp*time;
    f += 0.0625*noise( p );
    return f/0.9375;
}


vec4 l( in vec2 p, in vec2 a, in vec2 b)
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float d = length( pa - ba*h )/1.3;
          
    vec4 c = vec4(0.9,0.95,0.9,1.0);
    
    
    return smoothstep(lf/resolution.y, 0., d ) * c ;
            
}
 

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

float cross( vec2 a, vec2 b )
{
    return a.x*b.y - a.y*b.x;
}

vec3 pixelShader( in vec3 nor, in vec2 p, in float z, in vec3 wnor )
{
    vec4 cl = vec4(0);
    //p *= 2.0;
   // p.y = p.y-0.5;
    // set vector points over own texture ;
 
  // 6 faces 
    
    cl += l(p,vec2(-0.44,0.74),vec2(1.58,0.74));
    cl += l(p,vec2(-0.38,0.66),vec2(1.52,0.66));
    cl += l(p,vec2(1.58,0.74),vec2(2.28,0.10));
    cl += l(p,vec2(1.52,0.66),vec2(2.14,0.10));
    cl += l(p,vec2(2.28,0.10),vec2(1.58,-0.53));
    cl += l(p,vec2(2.14,0.10),vec2(1.50,-0.46));
    cl += l(p,vec2(1.58,-.53),vec2(-.55,-0.53));
    cl += l(p,vec2(1.50,-.46),vec2(-0.48,-0.46));
    cl += l(p,vec2(-0.55,-.53),vec2(-1.26,0.13));
    cl += l(p,vec2(-0.48,-.46),vec2(-1.12,0.12));
    cl += l(p,vec2(-1.26,.13),vec2(-0.44,0.74));
    cl += l(p,vec2(-1.12,.12),vec2(-.38,0.66));
 // F of Future ..   
      cl += l(p,vec2(-.35,.59),vec2(1.48,.59));
    
       cl += l(p,vec2(1.48,.59),vec2(1.29,.18));
    
       cl += l(p,vec2(1.29,.18),vec2(1.27,.30));
    
       cl += l(p,vec2(1.27,.30),vec2(1.25,.36));
       cl += l(p,vec2(1.25,.36),vec2(1.19,.41));
       
       cl += l(p,vec2(1.19,.41),vec2(0.34,.41));
       cl += l(p,vec2(0.34,.41),vec2(0.23,.19));
       cl += l(p,vec2(0.23,.19),vec2(0.78,.19));
       cl += l(p,vec2(0.78,.19),vec2(0.88,.22));
       cl += l(p,vec2(0.88,.22),vec2(1.01,.29));
    
       cl += l(p,vec2(1.01,.29),vec2(0.87,.00));
       cl += l(p,vec2(0.87,.00),vec2(0.80,.10));
    
       cl += l(p,vec2(0.80,.10),vec2(0.19,.10));
    
       cl += l(p,vec2(0.19,.10),vec2(0.07,-.16));
       cl += l(p,vec2(0.07,-.16),vec2(0.42,-.16));
     
       cl += l(p,vec2(0.42,-.16),vec2(0.34,-.36));
       cl += l(p,vec2(0.34,-.36),vec2(-0.51,-.36));
    
       cl += l(p,vec2(-.51,-.36),vec2(-0.39,-.28));
       cl += l(p,vec2(-.39,-.28),vec2(-0.36,-.24));   
       cl += l(p,vec2(-.36,-.24),vec2(-0.05,0.40)); 
       cl += l(p,vec2(-.05,.40),vec2(-0.46,0.40));  
       cl += l(p,vec2(-.46,.40),vec2(-0.35,0.59));
	
	
    
    return vec3(cl.xyz);
}
    


void main(void) {
    
        
mat4 mdv = setTranslation( 0.0, 0.8, -6.0) * 
		       setRotation( 0.,0. , 0. )*   setRotation(  0.0,time*2. , 0. )*
               RotationAxisAngle(vec3(0.0,0.0,0.0), 0.0 );
 
    vec2 px = ( 2.*gl_FragCoord.xy - resolution.xy ) / resolution.y;
       
   //  vec2 uv = gl_FragCoord / resolution.xy;
    
    // vec3 tx=texture2D(iChannel0,uv).xyz;
    
    createCube();
	 
    float scl = mod(gl_FragCoord.y ,2.0);
    
    vec3 color = vec3( 0.0, 0.0, 0.0 );

    // clear zbuffer
    float mindist = -1000000.0;

    
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

        // calculate areas for subtriangles
        vec3 di = vec3( cross( cp1 - cp0, px - cp0 ), 
					    cross( cp2 - cp1, px - cp1 ), 
					    cross( cp0 - cp2, px - cp2 ) );
		
        // if all positive, point is inside triangle
        if( all(greaterThan(di,vec3(-15.0))) )
        {
            // calc barycentric coordinates
            vec3 ba = di.yzx / (di.x+di.y+di.z);

            // barycentric interpolation of attributes and 1/z
            float iz = ba.x*w0 + ba.y*w1 + ba.z*w2;
            vec2  uv = ba.x*u0 + ba.y*u1 + ba.z*u2;

            // recover interpolated attributes
            float z = 1.0/iz;
             uv *= z;
 

				// perform lighting/shading
				color = pixelShader( nor, uv, z, triangles[1].n );
	  
    }

    vec3 tx= vec3(0.2,0.6,0.9);  // texture from IQ ...
	tx += 2.0*smoothstep( 0.53, 0.9, fbm( 0.8*px.yx + 9.0, 0.0 ) );
	tx *= 0.5 + 0.3*smoothstep( 0.2, 0.8, fbm( 4.0*px + fbm(32.0*px, 1.0), 2.0 ) );
        tx *= 0.8;
	
	
    gl_FragColor = vec4(mix(vec3(color)*tx,vec3(0.4,0.4,0.5)*1.2,0.1),1.0);
     
}