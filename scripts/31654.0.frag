//////////////////////////////
//Tablets have a really shitty graphics card
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define goTYPE vec2 p = ( gl_FragCoord.xy /resolution.xy ) * vec2(64,32);vec3 c = vec3(0);vec2 cpos = vec2(1,26);vec3 txColor = vec3(1);
#define goPRINT gl_FragColor = vec4(c, 1.0);

#define slashN cpos = vec2(1,cpos.y-6.);

#define inBLK txColor = vec3(0);
#define inWHT txColor = vec3(1);
#define inRED txColor = vec3(1,0,0);
#define inGRN txColor = vec3(0,1,0);
#define inBLU txColor = vec3(0,0,1);
#define CPOS cpos.x += 4.;if(cpos.x > 61.) slashN

// via http://www.dafont.com/pixelzim3x5.font
#define A c += txColor*Sprite3x5(31725.,floor(p-cpos));CPOS
#define B c += txColor*Sprite3x5(31663.,floor(p-cpos));CPOS
#define C c += txColor*Sprite3x5(31015.,floor(p-cpos));CPOS
#define D c += txColor*Sprite3x5(27502.,floor(p-cpos));CPOS
#define E c += txColor*Sprite3x5(31143.,floor(p-cpos));CPOS
#define F c += txColor*Sprite3x5(31140.,floor(p-cpos));CPOS
#define G c += txColor*Sprite3x5(31087.,floor(p-cpos));CPOS
#define H c += txColor*Sprite3x5(23533.,floor(p-cpos));CPOS
#define I c += txColor*Sprite3x5(29847.,floor(p-cpos));CPOS
#define J c += txColor*Sprite3x5(47196.,floor(p-cpos));CPOS
#define K c += txColor*Sprite3x5(23469.,floor(p-cpos));CPOS
#define L c += txColor*Sprite3x5(18727.,floor(p-cpos));CPOS
#define M c += txColor*Sprite3x5(24429.,floor(p-cpos));CPOS
#define N c += txColor*Sprite3x5(7148.,floor(p-cpos));CPOS
#define O c += txColor*Sprite3x5(31599.,floor(p-cpos));CPOS
#define P c += txColor*Sprite3x5(31716.,floor(p-cpos));CPOS
#define Q c += txColor*Sprite3x5(31609.,floor(p-cpos));CPOS
#define R c += txColor*Sprite3x5(27565.,floor(p-cpos));CPOS
#define S c += txColor*Sprite3x5(31183.,floor(p-cpos));CPOS
#define T c += txColor*Sprite3x5(29842.,floor(p-cpos));CPOS
#define U c += txColor*Sprite3x5(23407.,floor(p-cpos));CPOS
#define V c += txColor*Sprite3x5(23402.,floor(p-cpos));CPOS
#define W c += txColor*Sprite3x5(23421.,floor(p-cpos));CPOS
#define X c += txColor*Sprite3x5(23213.,floor(p-cpos));CPOS
#define Y c += txColor*Sprite3x5(23186.,floor(p-cpos));CPOS
#define Z c += txColor*Sprite3x5(29351.,floor(p-cpos));CPOS
#define n0 c += txColor*Sprite3x5(31599.,floor(p-cpos));CPOS
#define n1 c += txColor*Sprite3x5(9362.,floor(p-cpos));CPOS
#define n2 c += txColor*Sprite3x5(29671.,floor(p-cpos));CPOS
#define n3 c += txColor*Sprite3x5(29391.,floor(p-cpos));CPOS
#define n4 c += txColor*Sprite3x5(23497.,floor(p-cpos));CPOS
#define n5 c += txColor*Sprite3x5(31183.,floor(p-cpos));CPOS
#define n6 c += txColor*Sprite3x5(31215.,floor(p-cpos));CPOS
#define n7 c += txColor*Sprite3x5(29257.,floor(p-cpos));CPOS
#define n8 c += txColor*Sprite3x5(31727.,floor(p-cpos));CPOS
#define n9 c += txColor*Sprite3x5(31695.,floor(p-cpos));CPOS
#define DOT c += txColor*Sprite3x5(2.,floor(p-cpos));CPOS
#define COLON c += txColor*Sprite3x5(1040.,floor(p-cpos));CPOS
#define PLUS c += txColor*Sprite3x5(1488.,floor(p-cpos));CPOS
#define DASH c += txColor*Sprite3x5(448.,floor(p-cpos));CPOS
#define LPAREN c += txColor*Sprite3x5(10530.,floor(p-cpos));CPOS
#define RPAREN c += txColor*Sprite3x5(8778.,floor(p-cpos));CPOS

#define _ cpos.x += 4.;if(cpos.x > 61.) slashN

#define BLOCK c += txColor*Sprite3x5(32767.,floor(p-cpos));CPOS
#define QMARK c += txColor*Sprite3x5(25218.,floor(p-cpos));CPOS
#define EXCLAM c += txColor*Sprite3x5(9346.,floor(p-cpos));CPOS

float getBit(float num,float bit){
    num = floor(num);
    bit = floor(bit);
    return float(mod(floor(num/pow(2.,bit)),2.) == 1.0);
}

float Sprite3x5(float sprite,vec2 p){
    float bounds = float(all(lessThan(p,vec2(3,5))) && all(greaterThanEqual(p,vec2(0,0))));
    return getBit(sprite,(2.0 - p.x) + 3.0 * p.y) * bounds;
}

void main( void ) {
	float time = mod(time, 20.);
	goTYPE
	slashN
	//slashN
	if (time > 2.) {DASH}
	if (time > 5.2) {M}
	if (time > 5.4) {I}
	if (time > 5.6) {R}
	if (time > 6.14) {R}
	if (time > 6.26) {O}
	if (time > 6.38) {R}
	if (time > 7.0) {DASH}
	if (time > 11.) {slashN}
	if (time > 11.8) {S}
	if (time > 12.) {A}
	if (time > 12.2) {L}
	if (time > 12.4) {U}
	if (time > 12.6) {T}
	if (time > 12.8) {slashN}
	if (time > 12.18) {T}
	if (time > 12.20) {R}
	if (time > 12.31) {S}
	if (time > 12.43) {I}
	if (time > 13.2) {DASH}
	if (time > 13.18) {S}
	if (time > 13.20) {C}
	if (time > 13.26) {E}
	if (time > 13.34) {N}
	if (time > 13.46) {E}
	if (time > 13.53) {S}
	if (time > 13.63) {A}
	if (time > 13.73) {T}

	txColor = vec3(1.0-fract(time*1.33));
	BLOCK slashN

	goPRINT
}

