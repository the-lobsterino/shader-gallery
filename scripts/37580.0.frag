#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// from Gigatron France Paranoimia/ Shinobi Cracktro  // no math here :)

/// PARANOIMIA ELECTRONIC ARTISTS	
float pixelsize = 320.8;
vec2 mp = vec2(0.5, 0.5);

vec4 c1 = vec4(1.0, 1.0, 1.0, 1.0);
vec4 c0 = vec4(0.0, 0.0, 0.0, 1.0);


vec4 spr(int lx, int ly, vec4 bc) {
  // line 0
  // E_ ____ __
  if (ly >= 0 && ly <= 1) { if (lx >= 0 && lx <=6) return c1; }
  if (ly >= 4 && ly <= 5) { if (lx >= 0 && lx <=4) return c1; }
  if (ly >= 6 && ly <= 7) { if (lx >= 0 && lx <=2) return c1; } 
  if (ly >= 8 && ly <= 9) { if (lx >= 0 && lx <=6) return c1; }
  // L  
  if (ly >= 0 && ly <= 1) { if (lx >= 9 && lx <=11) return c1; }
  if (ly >= 4 && ly <= 9) { if (lx >= 9 && lx <=11) return c1; }   
  if (ly >= 8 && ly <= 9) { if (lx >= 11 && lx <=15) return c1;}
  // E  
  if (ly >= 0 && ly <= 1) { if (lx >= 18 && lx <=24) return c1; }
  if (ly >= 4 && ly <= 5) { if (lx >= 18 && lx <=22) return c1; }
  if (ly >= 6 && ly <= 7) { if (lx >= 18 && lx <=20) return c1; } 
  if (ly >= 8 && ly <= 9) { if (lx >= 18 && lx <=24) return c1; }
  // C
  if (ly >= 0 && ly <= 1) { if (lx >= 29 && lx <=32) return c1; }
  if (ly >= 2 && ly <= 3) { if (lx >= 32 && lx <=34) return c1; }
  if (ly >= 4 && ly <= 7) { if (lx >= 27 && lx <=29) return c1; }
  if (ly >= 6 && ly <= 7) { if (lx >= 32 && lx <=34) return c1; }  
  if (ly >= 8 && ly <= 9) { if (lx >= 29 && lx <=32) return c1; }  
  // t  
  if (ly >= 0 && ly <= 1) { if (lx >= 35 && lx <=40) return c1; }
  if (ly >= 4 && ly <= 9) { if (lx >= 39 && lx <=41) return c1; }   
  // r  
  if (ly >= 0 && ly <= 1) { if (lx >= 44 && lx <=49) return c1; }
  if (ly >= 2 && ly <= 3) { if (lx >= 49 && lx <=51) return c1; }  
  if (ly >= 4 && ly <= 5) { if (lx >= 44 && lx <=49) return c1; }  
  if (ly >= 5 && ly <= 9) { if (lx >= 44 && lx <=46) return c1; }  
  if (ly >= 6 && ly <= 9) { if (lx >= 49 && lx <=51) return c1; } 
  //  o
  if (ly >= 0 && ly <= 1) { if (lx >= 55 && lx <=59) return c1; } 
  if (ly >= 4 && ly <= 7) { if (lx >= 54 && lx <=56) return c1; }  
  if (ly >= 8 && ly <= 9) { if (lx >= 55 && lx <=60) return c1; }  
  if (ly >= 2 && ly <= 7) { if (lx >= 59 && lx <=61) return c1; }   
  // n
    
  if (ly >= 0 && ly <= 1) { if (lx >= 64 && lx <=70) return c1; }  
  if (ly >= 4 && ly <= 9) { if (lx >= 64 && lx <=66) return c1; }   
  if (ly >= 2 && ly <= 9) { if (lx >= 69 && lx <=71) return c1; }
  // i  
  if (ly >= 0 && ly <= 1) { if (lx >= 74 && lx <=80) return c1; }   
  if (ly >= 4 && ly <= 7) { if (lx >= 76 && lx <=78) return c1; }  
  if (ly >= 8 && ly <= 9) { if (lx >= 74 && lx <=80) return c1; }
    
  // c
    
  if (ly >= 0 && ly <= 1) { if (lx >= 85 && lx <=88) return c1; }
  if (ly >= 2 && ly <= 3) { if (lx >= 88 && lx <=90) return c1; }
  if (ly >= 4 && ly <= 7) { if (lx >= 83 && lx <=85) return c1; }
  if (ly >= 6 && ly <= 7) { if (lx >= 88 && lx <=90) return c1; }  
  if (ly >= 8 && ly <= 9) { if (lx >= 85 && lx <=88) return c1; }    
  
  // a
    
  if (ly >= 0 && ly <= 1) { if (lx >= 100 && lx <=104) return c1; }  
  if (ly >= 2 && ly <= 9) { if (lx >= 103 && lx <=105) return c1; }  
  if (ly >= 4 && ly <= 9) { if (lx >= 98 && lx <=100) return c1; } 
  if (ly >= 4 && ly <= 5) { if (lx >= 100 && lx <=104) return c1; } 
    
  // r
  if (ly >= 0 && ly <= 1) { if (lx >= 108 && lx <=113) return c1; }
  if (ly >= 2 && ly <= 3) { if (lx >= 113 && lx <=115) return c1; }  
  if (ly >= 4 && ly <= 5) { if (lx >= 108 && lx <=113) return c1; }  
  if (ly >= 5 && ly <= 9) { if (lx >= 108 && lx <=110) return c1; }  
  if (ly >= 6 && ly <= 9) { if (lx >= 113 && lx <=115) return c1; } 
   
  // t  
  if (ly >= 0 && ly <= 1) { if (lx >= 116 && lx <=121) return c1; }
  if (ly >= 4 && ly <= 9) { if (lx >= 120 && lx <=122) return c1; }    
    
  // i  
  if (ly >= 0 && ly <= 1) { if (lx >= 125 && lx <=131) return c1; }   
  if (ly >= 4 && ly <= 7) { if (lx >= 127 && lx <=129) return c1; }  
  if (ly >= 8 && ly <= 9) { if (lx >= 125 && lx <=131) return c1; }  
    
  if (ly >= 0 && ly <= 1) { if (lx >= 136 && lx <=142) return c1; }   
  if (ly >= 2 && ly <= 3) { if (lx >= 135 && lx <=137) return c1; }
  if (ly >= 4 && ly <= 5) { if (lx >= 136 && lx <=141) return c1; }  
  if (ly >= 6 && ly <= 7) { if (lx >= 139 && lx <=142) return c1; }   
  if (ly >= 8 && ly <= 9) { if (lx >= 135 && lx <=141) return c1; }
    
    
  // t  
  if (ly >= 0 && ly <= 1) { if (lx >= 145 && lx <=150) return c1; }
  if (ly >= 4 && ly <= 9) { if (lx >= 149 && lx <=152) return c1; }     
    
  if (ly >= 0 && ly <= 1) { if (lx >= 155 && lx <=161) return c1; }   
  if (ly >= 2 && ly <= 3) { if (lx >= 154 && lx <=156) return c1; }
  if (ly >= 4 && ly <= 5) { if (lx >= 155 && lx <=161) return c1; }  
  if (ly >= 6 && ly <= 7) { if (lx >= 159 && lx <=162) return c1; }   
  if (ly >= 8 && ly <= 9) { if (lx >= 155 && lx <=161) return c1; }  
    
    
  return bc;
}



#define PI 3.14159265359
#define DOWN_SCALE 2.0
#define MAX_INT_DIGITS 4
#define CHAR_SIZE vec2(8, 12)
#define CHAR_SPACING vec2(8, 12)
#define STRWIDTH(c) (c * CHAR_SPACING.x)
#define STRHEIGHT(c) (c * CHAR_SPACING.y)
#define NORMAL 0
#define INVERT 1
#define UNDERLINE 2

int TEXT_MODE = NORMAL;


//Automatically generated from the 8x12 font sheet here:
//http://www.massmind.org/techref/datafile/charset/extractor/charset_extractor.htm
// unused chars removed !
vec4 ch_spc = vec4(0x000000,0x000000,0x000000,0x000000);

vec4 ch_exc = vec4(0x003078,0x787830,0x300030,0x300000);

vec4 ch_per = vec4(0x000000,0x000000,0x000038,0x380000);

vec4 ch_A = vec4(0x003078,0xCCCCCC,0xFCCCCC,0xCC0000);
vec4 ch_B = vec4(0x00FC66,0x66667C,0x666666,0xFC0000);
vec4 ch_C = vec4(0x003C66,0xC6C0C0,0xC0C666,0x3C0000);
vec4 ch_D = vec4(0x00F86C,0x666666,0x66666C,0xF80000);
vec4 ch_E = vec4(0x00FE62,0x60647C,0x646062,0xFE0000);
vec4 ch_F = vec4(0x00FE66,0x62647C,0x646060,0xF00000);
vec4 ch_G = vec4(0x003C66,0xC6C0C0,0xCEC666,0x3E0000);
vec4 ch_H = vec4(0x00CCCC,0xCCCCFC,0xCCCCCC,0xCC0000);
vec4 ch_I = vec4(0x007830,0x303030,0x303030,0x780000);
vec4 ch_J = vec4(0x001E0C,0x0C0C0C,0xCCCCCC,0x780000);
vec4 ch_K = vec4(0x00E666,0x6C6C78,0x6C6C66,0xE60000);
vec4 ch_L = vec4(0x00F060,0x606060,0x626666,0xFE0000);
vec4 ch_M = vec4(0x00C6EE,0xFEFED6,0xC6C6C6,0xC60000);
vec4 ch_N = vec4(0x00C6C6,0xE6F6FE,0xDECEC6,0xC60000);
vec4 ch_O = vec4(0x00386C,0xC6C6C6,0xC6C66C,0x380000);
vec4 ch_P = vec4(0x00FC66,0x66667C,0x606060,0xF00000);
vec4 ch_Q = vec4(0x00386C,0xC6C6C6,0xCEDE7C,0x0C1E00);
vec4 ch_R = vec4(0x00FC66,0x66667C,0x6C6666,0xE60000);
vec4 ch_S = vec4(0x0078CC,0xCCC070,0x18CCCC,0x780000);
vec4 ch_T = vec4(0x00FCB4,0x303030,0x303030,0x780000);
vec4 ch_U = vec4(0x00CCCC,0xCCCCCC,0xCCCCCC,0x780000);
vec4 ch_V = vec4(0x00CCCC,0xCCCCCC,0xCCCC78,0x300000);
vec4 ch_W = vec4(0x00C6C6,0xC6C6D6,0xD66C6C,0x6C0000);
vec4 ch_X = vec4(0x00CCCC,0xCC7830,0x78CCCC,0xCC0000);
vec4 ch_Y = vec4(0x00CCCC,0xCCCC78,0x303030,0x780000);
vec4 ch_Z = vec4(0x00FECE,0x981830,0x6062C6,0xFE0000);

vec2 res = resolution.xy / DOWN_SCALE;
vec2 print_pos = vec2(0);

//Extracts bit b from the given number.
//Shifts bits right (num / 2^bit) then ANDs the result with 1 (mod(result,2.0)).
float extract_bit(float n, float b)
{
    b = clamp(b,-1.0,24.0);
	return floor(mod(floor(n / pow(2.0,floor(b))),2.0));   
}

//Returns the pixel at uv in the given bit-packed sprite.
float sprite(vec4 spr, vec2 size, vec2 uv)
{
    uv = floor(uv);
    
    //Calculate the bit to extract (x + y * width) (flipped on x-axis)
    float bit = (size.x-uv.x-1.0) + uv.y * size.x;
    
    //Clipping bound to remove garbage outside the sprite's boundaries.
    bool bounds = all(greaterThanEqual(uv,vec2(0))) && all(lessThan(uv,size));
    
    float pixels = 0.0;
    pixels += extract_bit(spr.x, bit - 72.0);
    pixels += extract_bit(spr.y, bit - 48.0);
    pixels += extract_bit(spr.z, bit - 24.0);
    pixels += extract_bit(spr.w, bit - 00.0);
    
    return bounds ? pixels : 0.0;
}

//Prints a character and moves the print position forward by 1 character width.
float char(vec4 ch, vec2 uv)
{
 
    float px = sprite(ch, CHAR_SIZE, uv - print_pos);
    print_pos.x += CHAR_SPACING.x;
    return px;
}

 

float text(vec2 uv)
{
    float col = 0.0;
    float t= mod(time,38.);// scroll duration 
    vec2 center = vec2(40.,1.);
    
    print_pos = (vec2(300.-t*30.0,21.0) - vec2(STRWIDTH(1.0),STRHEIGHT(1.0))/2.0);
 
    
    
    col += char(ch_Y,uv);
    col += char(ch_O,uv);
    col += char(ch_spc,uv);
    col += char(ch_Y,uv);
    col += char(ch_O,uv);
    col += char(ch_spc,uv);
    col += char(ch_Y,uv);
    col += char(ch_O,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    
     col += char(ch_spc,uv);
     col += char(ch_spc,uv);
     col += char(ch_spc,uv);
     col += char(ch_spc,uv);
  
	col += char(ch_P,uv);
    col += char(ch_A,uv);
    col += char(ch_R,uv);
    col += char(ch_A,uv);
    col += char(ch_N,uv);
    col += char(ch_O,uv);
    col += char(ch_I,uv);
    col += char(ch_M,uv);
    col += char(ch_I,uv);
    col += char(ch_A,uv);
    
    col += char(ch_spc,uv);
    
    col += char(ch_P,uv);
    col += char(ch_R,uv);
    col += char(ch_E,uv);
    col += char(ch_S,uv);
    col += char(ch_E,uv);
    col += char(ch_N,uv);
    col += char(ch_T,uv);
    col += char(ch_S,uv);
     col += char(ch_spc,uv);
    
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    
    col += char(ch_spc,uv);
    
    col += char(ch_S,uv);
    col += char(ch_H,uv);
    col += char(ch_I,uv);
    col += char(ch_N,uv);
    col += char(ch_O,uv);
    col += char(ch_B,uv);
    col += char(ch_I,uv);
      
    col += char(ch_spc,uv);
    
    
    col += char(ch_exc,uv);
    col += char(ch_exc,uv);
    col += char(ch_exc,uv);
      col += char(ch_spc,uv);
    
    col += char(ch_W,uv);
    col += char(ch_H,uv);
    col += char(ch_A,uv);
    col += char(ch_T,uv);
    
    col += char(ch_spc,uv);
    
     col += char(ch_A,uv);
     col += char(ch_spc,uv);
    

    col += char(ch_P,uv);
    col += char(ch_R,uv);
    col += char(ch_I,uv);
    col += char(ch_M,uv);
    col += char(ch_I,uv);
    col += char(ch_T,uv);
    col += char(ch_I,uv);
    col += char(ch_V,uv);
    col += char(ch_E,uv);
    
    col += char(ch_spc,uv);
    
    col += char(ch_P,uv);
    col += char(ch_R,uv);
    col += char(ch_O,uv);
    col += char(ch_T,uv);
    col += char(ch_E,uv);
    col += char(ch_C,uv);
    col += char(ch_T,uv);
    col += char(ch_I,uv);
    col += char(ch_O,uv);
    col += char(ch_N,uv);
    
    col += char(ch_spc,uv);
  
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
    col += char(ch_per,uv);
  
    return col;
}

vec4 bg = vec4(1.,0.,0.,0.0);
 
vec4 l( in vec2 p, in vec2 a, in vec2 b,in float t,in vec4 c )
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float d = length( pa - ba*h );
    
    return smoothstep(t/resolution.y, 0., d ) * c;
}


#define t iGlobalTime

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
    p *= 2.0;
    p.y = p.y-0.5;

    
         // P 
    cl += l(p-vec2(.1,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.1,0.6),vec2(0.0,0.0),vec2(.15,0.0),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.1,0.45),vec2(0.0,0.0),vec2(.15,0.0),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.25,0.6),vec2(0.0,0.0),vec2(.0,-.15),4.,vec4(1.,1.,1.,1.));
    
    /// A
    
    cl += l(p-vec2(.40,0.6),vec2(0.0,0.0),vec2(-.1,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.40,0.6),vec2(0.0,0.0),vec2(.1,-.32),4.,vec4(1.,1.,1.,1.));
    
   // r
    
    cl += l(p-vec2(.55,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.55,0.6),vec2(0.0,0.0),vec2(.15,0.0),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.55,0.45),vec2(0.0,0.0),vec2(.15,0.0),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.70,0.6),vec2(0.0,0.0),vec2(.0,-.15),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.55,0.45),vec2(0.0,0.0),vec2(.15,-0.17),4.,vec4(1.,1.,1.,1.));
    
    /// A
    
    cl += l(p-vec2(.85,0.6),vec2(0.0,0.0),vec2(-.1,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(.85,0.6),vec2(0.0,0.0),vec2(.1,-.32),4.,vec4(1.,1.,1.,1.));
    
    
     // N
    cl += l(p-vec2(1.0,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.0,0.6),vec2(0.0,0.0),vec2(.15,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.15,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    
    
    // O
   
    cl += l(p-vec2(1.2,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.2,0.6),vec2(0.0,0.0),vec2(.15,0.0),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.2,0.28),vec2(0.0,0.0),vec2(.15,0.0),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.35,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    
    // I
    cl += l(p-vec2(1.40,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    
    
     // m
    cl += l(p-vec2(1.45,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.45,0.6),vec2(0.0,0.0),vec2(.07,-.15),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.50,0.6),vec2(0.1,0.0),vec2(.02,-.15),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.60,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    
    //i
    
    cl += l(p-vec2(1.65,0.6),vec2(0.0,0.0),vec2(.0,-.32),4.,vec4(1.,1.,1.,1.));
    
    
    cl += l(p-vec2(1.80,0.6),vec2(0.0,0.0),vec2(-.1,-.32),4.,vec4(1.,1.,1.,1.));
    cl += l(p-vec2(1.80,0.6),vec2(0.0,0.0),vec2(.1,-.32),4.,vec4(1.,1.,1.,1.));    
    
 
    return vec3(cl.xyz);
}
    


void main() {
    
        
mat4 mdv = setTranslation( 0.0, 0.0, -2.0 ) * 
		       setRotation( time*3.,-time*2. , 0. )*
               RotationAxisAngle(vec3(0.0,0.0,0.0), 0.5 );
 
    vec2 px = gl_FragCoord.xy / resolution.xy*2.-1.;
    
         px.x *= resolution.x/resolution.y;
    

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

        //-----------------------------------
        // rasterize
        //-----------------------------------

        // calculate areas for subtriangles
        vec3 di = vec3( cross( cp1 - cp0, px - cp0 ), 
					    cross( cp2 - cp1, px - cp1 ), 
					    cross( cp0 - cp2, px - cp2 ) );
		
        // if all positive, point is inside triangle
        if( all(greaterThan(di,vec3(-10.0))) )
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

    gl_FragColor = vec4(color,1.0)*scl;
    
     
    /// starfield layer
    
     vec2 position = ( gl_FragCoord.xy - resolution.xy*.5 ) / resolution.x;

        // 256 angle steps
        float angle = atan(position.y,position.x)/(1.*3.14159265359);
        angle -= floor(angle);
        float rad = length(position*2.);
        
        float col = 0.0;
        for (int i = 0; i < 1; i++) {
            float angleFract = fract(angle*36.);
            float angleRnd = floor(angle*360.)+1.;
            float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*4.1);
            float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*1.724);
            float t = time+angleRnd1*10.;
            float radDist = sqrt(angleRnd2+float(i))*4.;
            
            float adist = radDist/rad*.1;
            float dist = (t*.2+adist)/2.;
            dist = abs(fract(dist)-.5);
            col += max(0.,.5-dist*100./adist)*(.5-abs(angleFract-.5))*5./adist/radDist;
            
            angle = fract(angle);
        }
       
   gl_FragColor += vec4(col,col,col,1.0);

        
    ////// bar layer rgb 12.9.2
    
    vec2 uv = gl_FragCoord.xy/resolution.xy ;
        
    if ((uv.y < 0.95) ^^ (uv.y < 0.90)) {
        gl_FragColor = vec4(vec3(12.,10.,220.0)/255.0, 0.0);
    }
    
    if ((uv.y < 0.10) ^^ (uv.y < 0.05)) {
        gl_FragColor = vec4(vec3(12.,10.,220.0)/255.0, 0.0);
    } 

// electronic artist ! thanks posano pixel map;

    mp = vec2(300., 65.0);
	
	vec2 p = 500.*gl_FragCoord.xy/resolution.xy ;
	int pxx = int(p.x  ) ;
	int pyy = int(p.y  );

	int mx = pxx - int(mp.x);
	int my = -(pyy - int(mp.y));

	vec4 bc = vec4(0.);
	gl_FragColor += spr(mx,my, bc);    
    
    
    
    
 /// text layer !!
    
    vec2 vt = 1024.*gl_FragCoord.xy / resolution.xy;
	float t1 = text(vt*0.28);
         t1 += text((vt*0.28)-vec2(0.,244.));
      
    vec3 colr = vec3(1);
    colr = mix(vec3(0.0),vec3(1.,1.,1.),t1);
 
	gl_FragColor += vec4(vec3(colr), 1.0);
   

    
}