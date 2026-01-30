#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//3x5 digit sprites stored in "15 bit" numbers
/*
███     111
  █     001
███  -> 111  -> 111001111100111 -> 29671
█       100
███     111
*/
/*
        000
        000
     -> 000  -> 000000000000010 -> 2
        000
 █      010
*/
/*
        000
 █      010
███  -> 111  -> 000010111010000 -> 1488
 █      010
        000
*/
/*
        000
        000
███  -> 111  -> 000000111000000 -> 448
        000
        000
*/

float c_0 = 31599.0;
float c_1 = 9362.0;
float c_2 = 29671.0;
float c_3 = 29391.0;
float c_4 = 23497.0;
float c_5 = 31183.0;
float c_6 = 31215.0;
float c_7 = 29257.0;
float c_8 = 31727.0;
float c_9 = 31695.0;

float c_x = 23213.0;
float c_y = 23186.0;
float c_colon = 1040.0;
float c_period = 2.0;
float c_plus  = 1488.0;
float c_minus = 448.0;

float c_alpha[26];
// Popultes the c_alpha with floats that represent capital (latin) letters A through Z
void DefineCAlpha(){
    // via http://www.dafont.com/pixelzim3x5.font
    //A~111101111101101
    c_alpha[0] = 31725.;
    //B~111101110101111
    c_alpha[1] = 31663.;
    //C~111100100100111
    c_alpha[2] = 31015.;
    //D~110101101101110
    c_alpha[3] = 27502.;
    //E~111100110100111
    c_alpha[4] = 31143.;
    //F~111100110100100
    c_alpha[5] = 31140.;
    //G~111100101101111
    c_alpha[6] = 31087.;
    //H~101101111101101
    c_alpha[7] = 23533.;
    //I~111010010010111
    c_alpha[8] = 29847.;
    //J~001001001101111
    c_alpha[9] = 4719.;
    //K~101101110101101
    c_alpha[10] = 23469.;
    //L~100100100100111
    c_alpha[11] = 18727.;
    //M~101111101101101
    c_alpha[12] = 24429.;
    //N~001101111101100
    c_alpha[13] = 7148.;
    //O~111101101101111
    c_alpha[14] = 31599.;
    //P~111101111100100
    c_alpha[15] = 31716.;
    //Q~111101101111001
    c_alpha[16] = 31609.;
    //R~110101110101101
    c_alpha[17] = 27565.;
    //S~111100111001111
    c_alpha[18] = 31183.;
    //T~111010010010010
    c_alpha[19] = 29842.;
    //U~101101101101111
    c_alpha[20] = 23407.;
    //V~101101101101010
    c_alpha[21] = 23402.;
    //W~101101101111101
    c_alpha[22] = 23421.;
    //X~101101010101101
    c_alpha[23] = 23213.;
    //Y~101101010010010
    c_alpha[24] = 23186.;
    //Z~111001010100111
    c_alpha[25] = 29351.;
    
    c_alpha[25] = 2.*cos(time*.1001234567890)/(.5+sin(time));
    
    int beat[3];
    beat[0]=beat[1]=beat[2]=0;
    if(fract(time)<0.333)beat[0]=1;
    else if(fract(time)<0.667)beat[1]=1;
    else if(fract(time)<1.)beat[2]=1;
    c_alpha[24] = 1.*float(beat[0])+2.*float(beat[1])+4.*float(beat[2])
        +8.*(1.*float(beat[1])+2.*float(beat[2])+4.*float(beat[0]))
        +8.*8.*(1.*float(beat[2])+2.*float(beat[0])+4.*float(beat[1]))
        +8.*8.*8.*(1.*float(beat[0])+2.*float(beat[1])+4.*float(beat[2]))
        +8.*8.*8.*8.*(1.*float(beat[1])+2.*float(beat[2])+4.*float(beat[0]))
        ;
}


//returns 0/1 based on the state of the given bit in the given number
float getBit(float num,float bit)
{
    num = floor(num);
    bit = floor(bit);
    
    return float(mod(floor(num/pow(2.,bit)),2.) == 1.0);
}

float Sprite3x5(float sprite,vec2 p)
{
    float bounds = float(all(lessThan(p,vec2(3,5))) && all(greaterThanEqual(p,vec2(0,0))));
    
    return getBit(sprite,(2.0 - p.x) + 3.0 * p.y) * bounds;
}

float debugPrint( vec2 m, vec2 p ) {
    float c = 0.0;

    //Mouse X position
    vec2 cpos = vec2(1,26); 
    
    DefineCAlpha();
    cpos.x = 1.;cpos.y -= 6.;
    c += Sprite3x5(c_alpha[18],floor(p-cpos)); // s
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[7],floor(p-cpos)); // h
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[0],floor(p-cpos)); // a
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[3],floor(p-cpos)); // d
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[4],floor(p-cpos)); // e
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[17],floor(p-cpos)); // r
    
    return c;
}

float debugPrint2( vec2 m, vec2 p ) {
    float c = 0.0;

    //Mouse X position
    vec2 cpos = vec2(1,26); 

    DefineCAlpha();
    cpos.x = 1.;cpos.y -= 6.;
    cpos.x += 4.;
    cpos.x += 4.;
    cpos.x += 4.;
    cpos.x += 4.;
    cpos.x += 4.;
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[7],floor(p-cpos)); // f
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[0],floor(p-cpos)); // r
    cpos.x += 4.;
    c += Sprite3x5(c_alpha[12],floor(p-cpos)); // o
    cpos.x += 2.;
    c += Sprite3x5(c_alpha[12],floor(p-cpos)); // g

    return c;
}

void main( void ) {
    vec2 p = ( gl_FragCoord.xy /resolution.xy ) * vec2(64,32);
    vec2 m = floor(mouse * resolution);

    float c = 0.0;
    float d = debugPrint2( m, p + vec2(cos(time*10.), 0.) );
	p.x += .2 * sin(p.y + time * 10.);
	p.x *= 1. - .05 * sin(time * 10.);
    c = debugPrint( m, p );
	
    gl_FragColor = vec4( vec3( c ) + vec3( 0.0, d, 0.0 ), 1.0 );
}
