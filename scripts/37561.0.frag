#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Gigatron France Paranoimia/ Shinobi Cracktro  // no math here :) 


#define CHAR_SIZE vec2(6, 7)
#define CHAR_SPACING vec2(6, 9)

#define DOWN_SCALE 1.5

vec2 res = resolution.xy / DOWN_SCALE;
vec2 start_pos = vec2(0);
vec2 print_pos = vec2(0);
vec2 print_pos_pre_move = vec2(0);
vec3 text_color = vec3(1);

#define HEX(i) text_color = mod(vec3(i / 65536,i / 256,i),vec3(256.0))/255.0;
#define RGB(r,g,b) text_color = vec3(r,g,b);

#define STRWIDTH(c) (c * CHAR_SPACING.x)
#define STRHEIGHT(c) (c * CHAR_SPACING.y)
#define BEGIN_TEXT(x,y) print_pos = floor(vec2(x,y)); start_pos = floor(vec2(x,y));

//Automatically generated from the sprite sheet here: http://uzebox.org/wiki/index.php?title=File:Font6x8.png
#define _ col+=char(vec2(0.0,0.0),uv);
#define _spc col+=char(vec2(0.0,0.0),uv)*text_color;
#define _exc col+=char(vec2(276705.0,32776.0),uv)*text_color;
#define _quo col+=char(vec2(1797408.0,0.0),uv)*text_color;
#define _hsh col+=char(vec2(10738.0,1134484.0),uv)*text_color;
#define _dol col+=char(vec2(538883.0,19976.0),uv)*text_color;
#define _pct col+=char(vec2(1664033.0,68006.0),uv)*text_color;
#define _amp col+=char(vec2(545090.0,174362.0),uv)*text_color;
#define _apo col+=char(vec2(798848.0,0.0),uv)*text_color;
#define _lbr col+=char(vec2(270466.0,66568.0),uv)*text_color;
#define _rbr col+=char(vec2(528449.0,33296.0),uv)*text_color;
#define _ast col+=char(vec2(10471.0,1688832.0),uv)*text_color;
#define _crs col+=char(vec2(4167.0,1606144.0),uv)*text_color;
#define _per col+=char(vec2(0.0,1560.0),uv)*text_color;
#define _dsh col+=char(vec2(7.0,1572864.0),uv)*text_color;
#define _com col+=char(vec2(0.0,1544.0),uv)*text_color;
#define _lsl col+=char(vec2(1057.0,67584.0),uv)*text_color;
#define _0 col+=char(vec2(935221.0,731292.0),uv)*text_color;
#define _1 col+=char(vec2(274497.0,33308.0),uv)*text_color;
#define _2 col+=char(vec2(934929.0,1116222.0),uv)*text_color;
#define _3 col+=char(vec2(934931.0,1058972.0),uv)*text_color;
#define _4 col+=char(vec2(137380.0,1302788.0),uv)*text_color;
#define _5 col+=char(vec2(2048263.0,1058972.0),uv)*text_color;
#define _6 col+=char(vec2(401671.0,1190044.0),uv)*text_color;
#define _7 col+=char(vec2(2032673.0,66576.0),uv)*text_color;
#define _8 col+=char(vec2(935187.0,1190044.0),uv)*text_color;
#define _9 col+=char(vec2(935187.0,1581336.0),uv)*text_color;
#define _col col+=char(vec2(195.0,1560.0),uv)*text_color;
#define _scl col+=char(vec2(195.0,1544.0),uv)*text_color;
#define _les col+=char(vec2(135300.0,66052.0),uv)*text_color;
#define _equ col+=char(vec2(496.0,3968.0),uv)*text_color;
#define _grt col+=char(vec2(528416.0,541200.0),uv)*text_color;
#define _que col+=char(vec2(934929.0,1081352.0),uv)*text_color;
#define _ats col+=char(vec2(935285.0,714780.0),uv)*text_color;
#define _A col+=char(vec2(935188.0,780450.0),uv)*text_color;
#define _B col+=char(vec2(1983767.0,1190076.0),uv)*text_color;
#define _C col+=char(vec2(935172.0,133276.0),uv)*text_color;
#define _D col+=char(vec2(1983764.0,665788.0),uv)*text_color;
#define _E col+=char(vec2(2048263.0,1181758.0),uv)*text_color;
#define _F col+=char(vec2(2048263.0,1181728.0),uv)*text_color;
#define _G col+=char(vec2(935173.0,1714334.0),uv)*text_color;
#define _H col+=char(vec2(1131799.0,1714338.0),uv)*text_color;
#define _I col+=char(vec2(921665.0,33308.0),uv)*text_color;
#define _J col+=char(vec2(66576.0,665756.0),uv)*text_color;
#define _K col+=char(vec2(1132870.0,166178.0),uv)*text_color;
#define _L col+=char(vec2(1065220.0,133182.0),uv)*text_color;
#define _M col+=char(vec2(1142100.0,665762.0),uv)*text_color;
#define _N col+=char(vec2(1140052.0,1714338.0),uv)*text_color;
#define _O col+=char(vec2(935188.0,665756.0),uv)*text_color;
#define _P col+=char(vec2(1983767.0,1181728.0),uv)*text_color;
#define _Q col+=char(vec2(935188.0,698650.0),uv)*text_color;
#define _R col+=char(vec2(1983767.0,1198242.0),uv)*text_color;
#define _S col+=char(vec2(935171.0,1058972.0),uv)*text_color;
#define _T col+=char(vec2(2035777.0,33288.0),uv)*text_color;
#define _U col+=char(vec2(1131796.0,665756.0),uv)*text_color;
#define _V col+=char(vec2(1131796.0,664840.0),uv)*text_color;
#define _W col+=char(vec2(1131861.0,699028.0),uv)*text_color;
#define _X col+=char(vec2(1131681.0,84130.0),uv)*text_color;
#define _Y col+=char(vec2(1131794.0,1081864.0),uv)*text_color;
#define _Z col+=char(vec2(1968194.0,133180.0),uv)*text_color;


//Extracts bit b from the given number.
float extract_bit(float n, float b)
{
	b = clamp(b,-1.0,22.0);
	return floor(mod(floor(n / pow(2.0,floor(b))),2.0));   
}

//Returns the pixel at uv in the given bit-packed sprite.
float sprite(vec2 spr, vec2 size, vec2 uv)
{
	uv = floor(uv);
	float bit = (size.x-uv.x-1.0) + uv.y * size.x;  
	bool bounds = all(greaterThanEqual(uv,vec2(0)))&& all(lessThan(uv,size)); 
	return bounds ? extract_bit(spr.x, bit - 21.0) + extract_bit(spr.y, bit) : 0.0;
}

//Prints a character and moves the print position forward by 1 character width.
vec3 char(vec2 ch, vec2 uv)
{
	float px = sprite(ch, CHAR_SIZE, uv - print_pos);
	print_pos.x += CHAR_SPACING.x;
	return vec3(px);
}

 

vec3 Text(vec2 uv)
{
    	vec3 col = vec3(0.0);
    	
    	vec2 center_pos = vec2(res.x/2.0 - STRWIDTH(20.0)/2.0,res.y/2.0 - STRHEIGHT(1.0)/2.0);
       	
    	BEGIN_TEXT(center_pos.x,center_pos.y)
	print_pos += vec2(-800.+mod(-time*50.,1280.),-100.);	
	
	HEX(0xFFFFFF) _Y _O _spc _Y _O _spc _Y _O _spc _per _per _per _per _spc _spc _spc _spc _P _A _R _A _N _O _I _M _I _A _spc _P _R _E _S _E _N _T _S _spc 
		      _per _per _per _spc _spc _S _H _I _N _O _B _I _spc _exc _exc _exc _spc _W _H _A _T _spc _A _spc _P _R _I _M  _I _T _I _V _E _spc
		      _P _R _O _T _E _C _T _I _O _N _spc _exc _exc _exc _exc _exc _exc _exc
	
	 
	
	
    
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


#define t time

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
    


void main(void) {
    
        
mat4 mdv = setTranslation( 0.0, 0.0, -2.0 ) * 
		       setRotation( t*3.,-t*2. , 0. )*
               RotationAxisAngle(vec3(0.0,0.0,0.0), 0.2 );
 
    vec2 px = gl_FragCoord.xy / resolution.xy*2.-1.;
    
    px.x *=resolution.x/resolution.y;
    

   createCube();
	 
    float scl =mod(gl_FragCoord.y ,2.0);
    
    vec3 color = vec3( 0.0, 0.0, 0.0 );

    // clear zbuffer
    float mindist = -1000000.0;

    // render 12 triangles
    for( int i=0; i<2; i++ )
    {
        // transform to eye space
        vec3 ep0 = (mdv * vec4(triangles[i].a,1.0)).xyz;
        vec3 ep1 = (mdv * vec4(triangles[i].b,1.0)).xyz;
        vec3 ep2 = (mdv * vec4(triangles[i].c,1.0)).xyz;
        vec3 nor = (mdv * vec4(triangles[i].n,0.0)).xyz;

        // transform to clip space
        float w0 = 1.0/ep0.z;
        float w1 = 1.0/ep1.z;
        float w2 = 1.0/ep2.z;

        vec2 cp0 = 2.0*ep0.xy * -w0;
        vec2 cp1 = 2.0*ep1.xy * -w1;
        vec2 cp2 = 2.0*ep2.xy * -w2;

        // fetch vertex attributes, and divide by z
        vec2 u0 = triangles[i].aUV * w0;
        vec2 u1 = triangles[i].bUV * w1;
        vec2 u2 = triangles[i].cUV * w2;

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

			// depth (-1/z) buffer test
			if( z>mindist )
			{
				mindist = z;

				// perform lighting/shading
				color = pixelShader( nor, uv, z, triangles[i].n );
			}
        }
    }

    gl_FragColor = vec4(color,1.0)*scl;
    
     
    /// starfield layer
    
     vec2 position = ( gl_FragCoord.xy - resolution.xy*.5 ) / resolution.x;

        // 256 angle steps
        float angle = atan(position.y,position.x)/(1.*3.14159265359);
        angle -= floor(angle);
        float rad = length(position);
        
        float col = 0.0;
        for (int i = 0; i < 1; i++) {
            float angleFract = fract(angle*36.);
            float angleRnd = floor(angle*360.)+1.;
            float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
            float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
            float t = time+angleRnd1*10.;
            float radDist = sqrt(angleRnd2+float(i));
            
            float adist = radDist/rad*.1;
            float dist = (t*.1+adist);
            dist = abs(fract(dist)-.5);
            col += max(0.,.5-dist*100./adist)*(.5-abs(angleFract-.5))*5./adist/radDist;
            
            angle = fract(angle);
        }
    
       
   gl_FragColor += vec4(col,col,col,1.0);

        
    ////// bar layer rgb 12.9.2
    
    vec2 uv = gl_FragCoord.xy /resolution.xy;
        
    if ((uv.y < 0.95) ^^ (uv.y < 0.90)) {
        gl_FragColor = vec4(vec3(12.,10.,220.0)/255.0, 0.0);
    }
    
    if ((uv.y < 0.10) ^^ (uv.y < 0.05)) {
        gl_FragColor = vec4(vec3(12.,10.,220.0)/255.0, 0.0);
    } 
    
 /// text layer !!
    
       vec2 uvt = gl_FragCoord.xy / DOWN_SCALE;
	vec2 duv = floor(gl_FragCoord.xy / DOWN_SCALE);
    
	vec3 pixel = Text(duv);
	     pixel += Text(duv-vec2(0.,202.));
    
	vec3 colr = pixel;
	//col *= (1.-distance(mod(uv,vec2(1.0)),vec2(0.65)))*1.2;
	
	gl_FragColor += vec4(vec3(colr), 1.0);
   
    // eof
    
    
}