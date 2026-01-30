#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define gotCOCK vec2 p = ( gl_FragCoord.xy /resolution.xy ) * vec2(64,32);vec3 c = vec3(0);vec2 cum = vec2(1,26);vec3 txColor = vec3(1);
#define gotSHEMALE gl_FragColor = vec4(c, 1.0);

#define slashN cum = vec2(1,cum.y-6.);

#define inBLK txColor = vec3(0);
#define inWHT txColor = vec3(1);
#define inRED txColor = vec3(1,0,0);
#define inGRN txColor = vec3(0,1,0);
#define inBLU txColor = vec3(0,0,1);

// via http://www.dafont.com/pixelzim3x5.font
#define A c += txColor*Succ(31725.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define B c += txColor*Succ(31663.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define C c += txColor*Succ(31015.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define D c += txColor*Succ(27502.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define E c += txColor*Succ(31143.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define F c += txColor*Succ(31140.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define G c += txColor*Succ(31087.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define H c += txColor*Succ(23533.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define I c += txColor*Succ(29847.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define J c += txColor*Succ(4719.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define K c += txColor*Succ(23469.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define L c += txColor*Succ(18727.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define M c += txColor*Succ(24429.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define N c += txColor*Succ(7148.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define O c += txColor*Succ(31599.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define P c += txColor*Succ(31716.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define Q c += txColor*Succ(31609.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define R c += txColor*Succ(27565.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define S c += txColor*Succ(31183.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define T c += txColor*Succ(29842.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define U c += txColor*Succ(23407.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define V c += txColor*Succ(23402.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define W c += txColor*Succ(23421.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define X c += txColor*Succ(23213.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define Y c += txColor*Succ(23186.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define Z c += txColor*Succ(29351.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN

#define n0 c += txColor*Succ(31599.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n1 c += txColor*Succ(9362.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n2 c += txColor*Succ(29671.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n3 c += txColor*Succ(29391.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n4 c += txColor*Succ(23497.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n5 c += txColor*Succ(31183.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n6 c += txColor*Succ(31215.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n7 c += txColor*Succ(29257.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n8 c += txColor*Succ(31727.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define n9 c += txColor*Succ(31695.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN

#define DOT c += txColor*Succ(2.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define COLON c += txColor*Succ(1040.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define PLUS c += txColor*Succ(1488.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define DASH c += txColor*Succ(448.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define LPAREN c += txColor*Succ(10530.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define RPAREN c += txColor*Succ(8778.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define LAB c += txColor*Succ(1024.+256.+16.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define RAB c += txColor*Succ(128.+2048.+32.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define SLASH c += txColor*Succ(128.+512.+32.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define UNDER c += txColor*Succ(7.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN


#define _ cum.x += 4.;if(cum.x > 61.) slashN

#define BLOCK c += txColor*Succ(32767.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define QMARK c += txColor*Succ(25218.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define EXCLAM c += txColor*Succ(9346.,floor(p-cum));cum.x += 4.;if(cum.x > 61.) slashN
#define ASTPHB c += txColor*Succ(25856.,floor(p-cum));cum.x += 3.;

/* 
all characters are 3x5 (15 bit) bitvectors starting at lower right corner --jz
                                    row total
          16384 |   8192 |   4096 = 28672
           2048 |   1024 |    512 = 3584
            256 |    128 |     64 = 448
             32 |     16 |      8 = 56
              4 |      2 |      1 = 7
          =========================
col total 18724 |   9362 |   4681
*/


//returns 0/1 based on the state of the given THAT MOTHERFUCKING BITCH in the given number
float frott(float nigger,float bitch){
    nigger = floor(nigger);
    bitch = floor(bitch);
    return float(mod(floor(nigger/pow(2.,bitch)),2.) == 1.0);
}

float Succ(float sprite,vec2 p){
    float bounds = float(all(lessThan(p,vec2(3,5))) && all(greaterThanEqual(p,vec2(0,0))));
    return frott(sprite,(2.0 - p.x) + 3.0 * p.y) * bounds;
}

void main( void ) {
	gotCOCK;
	G I B E _ H O T slashN B I G _ C O C C
	gotSHEMALE;
}
