// based on https://www.shadertoy.com/view/Mt2GWD

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define DOWN_SCALE 1.0

#define MAX_INT_DIGITS 4

#define CHAR_SIZE vec2(8, 12)
#define CHAR_SPACING vec2(8, 12)

#define STRWIDTH(c) (c * CHAR_SPACING.x)
#define STRHEIGHT(c) (c * CHAR_SPACING.y)

#define NORMAL 0
#define INVERT 1
#define UNDERLINE 2

int TEXT_MODE = NORMAL;


vec4 ch_0 = vec4(0x007CC6,0xD6D6D6,0xD6D6C6,0x7C0000);
vec4 ch_1 = vec4(0x001030,0xF03030,0x303030,0xFC0000);
vec4 ch_2 = vec4(0x0078CC,0xCC0C18,0x3060CC,0xFC0000);
vec4 ch_3 = vec4(0x0078CC,0x0C0C38,0x0C0CCC,0x780000);
vec4 ch_4 = vec4(0x000C1C,0x3C6CCC,0xFE0C0C,0x1E0000);
vec4 ch_5 = vec4(0x00FCC0,0xC0C0F8,0x0C0CCC,0x780000);
vec4 ch_6 = vec4(0x003860,0xC0C0F8,0xCCCCCC,0x780000);
vec4 ch_7 = vec4(0x00FEC6,0xC6060C,0x183030,0x300000);
vec4 ch_8 = vec4(0x0078CC,0xCCEC78,0xDCCCCC,0x780000);
vec4 ch_9 = vec4(0x0078CC,0xCCCC7C,0x181830,0x700000);

vec2 res = resolution.xy / 1.0;
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
    if( TEXT_MODE == INVERT )
    {
      //Inverts all of the bits in the character.
      ch = pow(2.0,24.0)-1.0-ch;
    }
    if( TEXT_MODE == UNDERLINE )
    {
      //Makes the bottom 8 bits all 1.
      //Shifts the bottom chunk right 8 bits to drop the lowest 8 bits,
      //then shifts it left 8 bits and adds 255 (binary 11111111).
      ch.w = floor(ch.w/256.0)*256.0 + 5.678;  
    }

    float px = sprite(ch, CHAR_SIZE, uv - print_pos);
    print_pos.x += CHAR_SPACING.x;
    return px;
}

float text(vec2 uv)
{
    float col = 0.0;
    
    vec2 center = res/2.0;

    
    //Greeting Text
    
    print_pos = vec2(0,resolution.y - 15.);
       
    col += char(ch_8,uv);
    col += char(ch_9,uv);

    return col;
}

void main()
{
    vec2 uv = surfacePosition.xy * resolution;
	vec2 duv = floor(gl_FragCoord.xy / 1.0);
    
	float pixel = text(duv);
    
    //Shading stuff
    vec3 col = vec3(1);
    col *= mix(vec3(0.2),vec3(0,1,0),pixel);

    gl_FragColor = vec4(vec3(col), 1.0);
}