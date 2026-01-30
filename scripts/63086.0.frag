/*
 * Original shader from: https://www.shadertoy.com/view/MdyGz3
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
//------------------------------------------------------------------------
// Jason Colman Feb 2016
// "lite lore"
// "Knight Lore" sprite animation
//------------------------------------------------------------------------

/*
Thanks to P_Malin for creating this shader:
"R Tape loading error, 0:1"
https://www.shadertoy.com/view/lsl3Rn
A huge inspiration, showing what is possible for true 
 speccy lovers :)
*/

#define SPRITE_ARCH1 0
#define SPRITE_ARCH2 1
#define SPRITE_WALL1 2
#define SPRITE_WULF 10

#define BITS_PER_BYTE 32.

//------------------------------------------------------------------------
// P_Malin code below
//vec2 kResolution = vec2(256.0, 192.0);
vec2 kResolution = vec2(192.0, 128.0);
//vec2 kResolution = vec2(128.0, 80.0);
//vec2 kResolution = vec2(64.0, 40.0);

vec2 GetScreenPixelCoord( vec2 vScreenUV )
{
    vec2 vPixelPos = floor(vScreenUV * kResolution);
    vPixelPos.y = kResolution.y - vPixelPos.y - 1.;   
    return vPixelPos;
}

//------------------------------------------------------------------------
// Based on P_Malin code
float getIntBit(int byte, int bit)
{
    int p = int(pow(2., BITS_PER_BYTE - 1. - float(bit)));
    return mod(floor(float(byte / p)), 2.);
}

int wulf1(int a)
{
    int r = 0;
    r = (a < 20) ? 234625024 : (a < 21) ? 116132864 : (a < 22) ? 116655616 : (a < 23) ? 116655616 : (a < 24) ? 234359808 : (a < 25) ? 49807360 : (a < 26) ? 125304832 : (a < 27) ? 24117248 : (a < 28) ? 13107200 : (a < 29) ? 13107200 : (a < 30) ? 31457280 : (a < 31) ? 16252928 : (a < 32) ? 4063232 : (a < 33) ? 917504 : (a < 34) ? 131072 : (a < 35) ? 0 : (a < 36) ? 0 : (a < 37) ? 0 : (a < 38) ? 0 : (a < 39) ? 0 : r;
    r = (a < 0) ? 0 : (a < 1) ? 134219776 : (a < 2) ? 100675584 : (a < 3) ? 129949696 : (a < 4) ? 67067904 : (a < 5) ? 67084288 : (a < 6) ? 31768576 : (a < 7) ? 32407552 : (a < 8) ? 50298880 : (a < 9) ? 67092480 : (a < 10) ? 65880064 : (a < 11) ? 66568192 : (a < 12) ? 70533120 : (a < 13) ? 265617408 : (a < 14) ? 535003136 : (a < 15) ? 1056718848 : (a < 16) ? 1040146432 : (a < 17) ? 469721088 : (a < 18) ? 469725184 : (a < 19) ? 234762240 : r;
    return r;
}

int wulf1mask(int a)
{
    int r = 0;
    r = (a < 20) ? 536755200 : (a < 21) ? 268312064 : (a < 22) ? 268308224 : (a < 23) ? 268308224 : (a < 24) ? 536616448 : (a < 25) ? 268176384 : (a < 26) ? 268173312 : (a < 27) ? 133693440 : (a < 28) ? 33292288 : (a < 29) ? 33292288 : (a < 30) ? 66584576 : (a < 31) ? 33423360 : (a < 32) ? 8323072 : (a < 33) ? 2031616 : (a < 34) ? 458752 : (a < 35) ? 196608 : (a < 36) ? 0 : (a < 37) ? 0 : (a < 38) ? 0 : (a < 39) ? 0 : r;
    r = (a < 0) ? 402656256 : (a < 1) ? 503331840 : (a < 2) ? 268433408 : (a < 3) ? 268431360 : (a < 4) ? 134213632 : (a < 5) ? 134213632 : (a < 6) ? 67100672 : (a < 7) ? 67092480 : (a < 8) ? 134201344 : (a < 9) ? 134209536 : (a < 10) ? 134209536 : (a < 11) ? 134209536 : (a < 12) ? 268427264 : (a < 13) ? 536854528 : (a < 14) ? 1073725440 : (a < 15) ? 2147475456 : (a < 16) ? 2147479552 : (a < 17) ? 1073737728 : (a < 18) ? 1073739776 : (a < 19) ? 536836096 : r;
    return r;
}

int wulf2(int a)
{
    int r = 0;
    r = (a < 20) ? 528418816 : (a < 21) ? 127893504 : (a < 22) ? 64978944 : (a < 23) ? 233799680 : (a < 24) ? 2120712192 : (a < 25) ? 2120450048 : (a < 26) ? 1615265792 : (a < 27) ? 2015100928 : (a < 28) ? 503808000 : (a < 29) ? 126083072 : (a < 30) ? 8452096 : (a < 31) ? 14336 : (a < 32) ? 2048 : (a < 33) ? 0 : (a < 34) ? 0 : (a < 35) ? 0 : (a < 36) ? 0 : (a < 37) ? 0 : (a < 38) ? 0 : (a < 39) ? 0 : r;
    r = (a < 0) ? 0 : (a < 1) ? 134219776 : (a < 2) ? 100675584 : (a < 3) ? 129949696 : (a < 4) ? 67067904 : (a < 5) ? 67084288 : (a < 6) ? 31768576 : (a < 7) ? 32407552 : (a < 8) ? 50298880 : (a < 9) ? 67092480 : (a < 10) ? 65880064 : (a < 11) ? 66568192 : (a < 12) ? 70533120 : (a < 13) ? 265617408 : (a < 14) ? 266567680 : (a < 15) ? 251412480 : (a < 16) ? 251621376 : (a < 17) ? 251623424 : (a < 18) ? 520034304 : (a < 19) ? 520034304 : r;
    return r;
}

int wulf2mask(int a)
{
    int r = 0;
    r = (a < 20) ? 1073716224 : (a < 21) ? 536856576 : (a < 22) ? 268419072 : (a < 23) ? 2113912832 : (a < 24) ? 2147467264 : (a < 25) ? 2147467264 : (a < 26) ? 2130673664 : (a < 27) ? 2118090752 : (a < 28) ? 2141184000 : (a < 29) ? 533198848 : (a < 30) ? 130284544 : (a < 31) ? 64512 : (a < 32) ? 15360 : (a < 33) ? 2048 : (a < 34) ? 0 : (a < 35) ? 0 : (a < 36) ? 0 : (a < 37) ? 0 : (a < 38) ? 0 : (a < 39) ? 0 : r;
    r = (a < 0) ? 402656256 : (a < 1) ? 503331840 : (a < 2) ? 268433408 : (a < 3) ? 268431360 : (a < 4) ? 134213632 : (a < 5) ? 134213632 : (a < 6) ? 67100672 : (a < 7) ? 67092480 : (a < 8) ? 134201344 : (a < 9) ? 134209536 : (a < 10) ? 134209536 : (a < 11) ? 134209536 : (a < 12) ? 268427264 : (a < 13) ? 536723456 : (a < 14) ? 536854528 : (a < 15) ? 536866816 : (a < 16) ? 536868864 : (a < 17) ? 536869888 : (a < 18) ? 1073724416 : (a < 19) ? 1073724416 : r;
    return r;
}

int arch1mask(const int a)
{
    int r = 0;
    r = (a < 40) ? 2147352576 : (a < 41) ? 2147352576 : (a < 42) ? 2147352576 : (a < 43) ? 2147352576 : (a < 44) ? 2147352576 : (a < 45) ? 2147352576 : (a < 46) ? 2147352576 : (a < 47) ? 2147352576 : (a < 48) ? 2147352576 : (a < 49) ? 2147352576 : (a < 50) ? 1073610752 : (a < 51) ? 268304384 : (a < 52) ? 66846720 : (a < 53) ? 15728640 : (a < 54) ? 6291456 : (a < 55) ? 0 : (a < 56) ? 0 : (a < 57) ? 0 : (a < 58) ? 0 : (a < 59) ? 0 : r;
    r = (a < 20) ? 268419072 : (a < 21) ? 536854528 : (a < 22) ? 536854528 : (a < 23) ? 536854528 : (a < 24) ? 1073725440 : (a < 25) ? 1073709056 : (a < 26) ? 1073709056 : (a < 27) ? 1073709056 : (a < 28) ? 1073676288 : (a < 29) ? 1073676288 : (a < 30) ? 2147418112 : (a < 31) ? 2147352576 : (a < 32) ? 2147352576 : (a < 33) ? 2147352576 : (a < 34) ? 2147352576 : (a < 35) ? 2147352576 : (a < 36) ? 2147352576 : (a < 37) ? 2147352576 : (a < 38) ? 2147352576 : (a < 39) ? 2147352576 : r;
    r = (a < 0) ? 3072 : (a < 1) ? 32512 : (a < 2) ? 65408 : (a < 3) ? 131040 : (a < 4) ? 262112 : (a < 5) ? 524256 : (a < 6) ? 1048544 : (a < 7) ? 2097120 : (a < 8) ? 4194272 : (a < 9) ? 8388544 : (a < 10) ? 16777088 : (a < 11) ? 16776960 : (a < 12) ? 33554176 : (a < 13) ? 33554176 : (a < 14) ? 67108352 : (a < 15) ? 134216704 : (a < 16) ? 134215680 : (a < 17) ? 268433408 : (a < 18) ? 268431360 : (a < 19) ? 268427264 : r;
    return r;
}

int arch1(int a)
{
    int r = 0;
    r = (a < 40) ? 1069285376 : (a < 41) ? 1069285376 : (a < 42) ? 1069285376 : (a < 43) ? 263979008 : (a < 44) ? 867696640 : (a < 45) ? 1017380864 : (a < 46) ? 1058799616 : (a < 47) ? 1069285376 : (a < 48) ? 1069285376 : (a < 49) ? 1069285376 : (a < 50) ? 263979008 : (a < 51) ? 62652416 : (a < 52) ? 12058624 : (a < 53) ? 6291456 : (a < 54) ? 0 : (a < 55) ? 0 : (a < 56) ? 0 : (a < 57) ? 0 : (a < 58) ? 0 : (a < 59) ? 0 : r;
    r = (a < 20) ? 133660672 : (a < 21) ? 267878400 : (a < 22) ? 66551808 : (a < 23) ? 217546752 : (a < 24) ? 523206656 : (a < 25) ? 532676608 : (a < 26) ? 535756800 : (a < 27) ? 534708224 : (a < 28) ? 534642688 : (a < 29) ? 131989504 : (a < 30) ? 970850304 : (a < 31) ? 1045430272 : (a < 32) ? 1066139648 : (a < 33) ? 1069285376 : (a < 34) ? 1069285376 : (a < 35) ? 1069285376 : (a < 36) ? 263979008 : (a < 37) ? 867696640 : (a < 38) ? 1017380864 : (a < 39) ? 1058799616 : r;
    r = (a < 0) ? 0 : (a < 1) ? 3072 : (a < 2) ? 25344 : (a < 3) ? 63680 : (a < 4) ? 130560 : (a < 5) ? 261952 : (a < 6) ? 523968 : (a < 7) ? 1048000 : (a < 8) ? 1309632 : (a < 9) ? 3995520 : (a < 10) ? 8335104 : (a < 11) ? 8375808 : (a < 12) ? 16758272 : (a < 13) ? 8354304 : (a < 14) ? 27229184 : (a < 15) ? 65468416 : (a < 16) ? 66711552 : (a < 17) ? 133984256 : (a < 18) ? 133922816 : (a < 19) ? 133939200 : r;
    return r;
}
    
int arch2(int a)
{
    int r = 0;
    r = (a < 20) ? 126615552 : (a < 21) ? 133365760 : (a < 22) ? 32964608 : (a < 23) ? 108462080 : (a < 24) ? 127270912 : (a < 25) ? 132186112 : (a < 26) ? 133627904 : (a < 27) ? 32964608 : (a < 28) ? 108462080 : (a < 29) ? 127303680 : (a < 30) ? 132186112 : (a < 31) ? 133627904 : (a < 32) ? 133627904 : (a < 33) ? 133627904 : (a < 34) ? 32964608 : (a < 35) ? 7798784 : (a < 36) ? 1441792 : (a < 37) ? 0 : (a < 38) ? 0 : (a < 39) ? 0 : r;
    r = (a < 0) ? 0 : (a < 1) ? 0 : (a < 2) ? 0 : (a < 3) ? 0 : (a < 4) ? 0 : (a < 5) ? 805306368 : (a < 6) ? 1006632960 : (a < 7) ? 1023410176 : (a < 8) ? 998244352 : (a < 9) ? 465567744 : (a < 10) ? 1740636160 : (a < 11) ? 967835648 : (a < 12) ? 1048051712 : (a < 13) ? 125304832 : (a < 14) ? 431751168 : (a < 15) ? 238551040 : (a < 16) ? 264634368 : (a < 17) ? 266207232 : (a < 18) ? 32374784 : (a < 19) ? 107937792 : r;
    return r;
}

int arch2mask(int a)
{
    int r = 0;
    r = (a < 20) ? 268402688 : (a < 21) ? 268402688 : (a < 22) ? 268402688 : (a < 23) ? 268402688 : (a < 24) ? 268402688 : (a < 25) ? 268402688 : (a < 26) ? 268402688 : (a < 27) ? 268402688 : (a < 28) ? 268402688 : (a < 29) ? 268419072 : (a < 30) ? 268402688 : (a < 31) ? 268402688 : (a < 32) ? 268402688 : (a < 33) ? 268402688 : (a < 34) ? 134184960 : (a < 35) ? 33521664 : (a < 36) ? 8323072 : (a < 37) ? 1966080 : (a < 38) ? 0 : (a < 39) ? 0 : r;
    r = (a < 0) ? 0 : (a < 1) ? 0 : (a < 2) ? 0 : (a < 3) ? 0 : (a < 4) ? 1879048192 : (a < 5) ? 2013265920 : (a < 6) ? 2113929216 : (a < 7) ? 2139095040 : (a < 8) ? 2143289344 : (a < 9) ? 2145386496 : (a < 10) ? 2145386496 : (a < 11) ? 2146959360 : (a < 12) ? 2147221504 : (a < 13) ? 1073479680 : (a < 14) ? 1073610752 : (a < 15) ? 536739840 : (a < 16) ? 536805376 : (a < 17) ? 536805376 : (a < 18) ? 268369920 : (a < 19) ? 268402688 : r;
    return r;
}

int wall1(int a)
{
    return (a < 0) ? 0 : (a < 1) ? 25165824 : (a < 2) ? 1105199104 : (a < 3) ? 1912078336 : (a < 4) ? 2088632320 : (a < 5) ? 2132770816 : (a < 6) ? 2143805440 : (a < 7) ? 2144466944 : (a < 8) ? 1071414784 : (a < 9) ? 266280832 : (a < 10) ? 63948672 : (a < 11) ? 12841344 : (a < 12) ? 64512 : (a < 13) ? 16128 : (a < 14) ? 4032 : (a < 15) ? 1008 : (a < 16) ? 112 : (a < 17) ? 16 : 0;
}

// Return val:
// -1 = no colour at this pixel pos
// 0 and 1 = pixel colour
float getPixel(vec2 pos, int spriteId)
{
    // Convert pixel pos to sprite byte address
    float c = floor(pos.x / BITS_PER_BYTE);
    int address = int(pos.y); 
        
    // Sprites are 1 "byte" wide, i.e. up to 31 bits
    if (c > 0. || c < 0. || address < 0)
        return -1.;
    
    float byte = -1.;
    
    int bit = int(mod(pos.x, BITS_PER_BYTE));
    if (spriteId == SPRITE_ARCH1)
    {
        int f = arch1mask(address);
        if (getIntBit(f, bit) > 0.)
            return (getIntBit(arch1(address), bit));
    }
    else if (spriteId == SPRITE_ARCH2)
    {
        int f = arch2mask(address);
        if (getIntBit(f, bit) > 0.)
            return (getIntBit(arch2(address), bit));
    }
    else if (spriteId == SPRITE_WALL1)
    {
        // Furthes away so no need for mask, right?
        return (getIntBit(wall1(address), bit));
    }
    else if (spriteId == SPRITE_WULF)
    {        
        // Walk anim
        float frame = fract(iTime * 2.);        
        if (frame > .5)
        {
            int f = wulf1mask(address);
            if (getIntBit(f, bit) > 0.)
                return (getIntBit(wulf1(address), bit));
        }
        else
        {
            int f = wulf2mask(address);
            if (getIntBit(f, bit) > 0.)
                return (getIntBit(wulf2(address), bit));
        }
    }
    
    return -1.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{    
	vec2 uv = fragCoord.xy / iResolution.xy;

    vec2 pos = GetScreenPixelCoord(uv);
    
    // To move
    //pos.x -= floor(iTime * 2.);
    
    pos.y -= 5.;
    
    // Mirror image - but also mirrors position around screen
    //  centre
    //pos.x += kResolution.x / 2.; 
    //pos.x = kResolution.x - pos.x + 24.;

    float t = mod(iTime, 7.0) - 3.;
    float SPEED = 40.;
    float archx = 140. - t * SPEED;
    float archy = 60.  - t * .5 * SPEED;
    
    vec2 archpos = floor(pos - vec2(archx, archy));
    float p = getPixel(archpos, SPRITE_ARCH1);
    
    if (p < 0.)
    {
        vec2 wulfpos = pos - vec2(80, 40);
        p = getPixel(wulfpos, SPRITE_WULF); 
        if (p > 0.)
        {
            fragColor.rgba = vec4(0, 1, 0, 1); 
            return;
        }
    }

    if (p < 0.)
    {
        // Far side of arch
        archpos = floor(pos - vec2(archx + 25., archy - 0.));
        p = getPixel(archpos, SPRITE_ARCH2);
    }

    // Wall pieces: this should be random.
    // Wall with arch should only become visible once we have
    //  gone through the arch.
    if (t < 2. && p < 0.)
    {
        // Wall
        archpos = floor(pos - vec2(archx + 55., archy - 0.));
        p = getPixel(archpos, SPRITE_WALL1);
    }

    if (t > 0. && p < 0.)
    {
        // Wall
        archpos = floor(pos - vec2(archx + 75., archy - 20.));
        p = getPixel(archpos, SPRITE_WALL1);
    }

	fragColor.rgb = mix(vec3(0), vec3(0, 1, 1), p);
    fragColor.a = 1.;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}