#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define goTYPE vec2 p = ( gl_FragCoord.xy /resolution.xy ) * vec2(64,32);vec3 c = vec3(0);vec2 cpos = vec2(1,31);vec3 txColor = vec3(1);
#define goPRINT gl_FragColor = vec4(c, 1.0);
#define slashN cpos = vec2(1,cpos.y-6.);
#define inBLK txColor = vec3(0);
#define inWHT txColor = vec3(1);
#define inRED txColor = vec3(1,0,0);
#define inYEL txColor = vec3(1,1,0);
#define inGRN txColor = vec3(0,1,0);
#define inCYA txColor = vec3(0,1,1);
#define inBLU txColor = vec3(0,0,1);
#define inPUR txColor = vec3(1,0,1);
#define inPCH txColor = vec3(1,0.7,0.6);
#define inPNK txColor = vec3(1,0.7,1);
#define A c += txColor*Sprite3x5(31725.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define B c += txColor*Sprite3x5(31663.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define C c += txColor*Sprite3x5(31015.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define D c += txColor*Sprite3x5(27502.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define E c += txColor*Sprite3x5(31143.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define F c += txColor*Sprite3x5(31140.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define G c += txColor*Sprite3x5(31087.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define H c += txColor*Sprite3x5(23533.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define I c += txColor*Sprite3x5(29847.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define J c += txColor*Sprite3x5(4719.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define K c += txColor*Sprite3x5(23469.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define L c += txColor*Sprite3x5(18727.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define M c += txColor*Sprite3x5(24429.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define N c += txColor*Sprite3x5(7148.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define O c += txColor*Sprite3x5(31599.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define P c += txColor*Sprite3x5(31716.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define Q c += txColor*Sprite3x5(31609.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define R c += txColor*Sprite3x5(27565.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define S c += txColor*Sprite3x5(31183.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define T c += txColor*Sprite3x5(29842.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define U c += txColor*Sprite3x5(23407.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define V c += txColor*Sprite3x5(23402.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define W c += txColor*Sprite3x5(23421.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define X c += txColor*Sprite3x5(23213.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define Y c += txColor*Sprite3x5(23186.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define Z c += txColor*Sprite3x5(29351.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n0 c += txColor*Sprite3x5(31599.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n1 c += txColor*Sprite3x5(9362.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n2 c += txColor*Sprite3x5(29671.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n3 c += txColor*Sprite3x5(29391.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n4 c += txColor*Sprite3x5(23498.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n5 c += txColor*Sprite3x5(31183.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n6 c += txColor*Sprite3x5(31215.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n7 c += txColor*Sprite3x5(29257.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n8 c += txColor*Sprite3x5(31727.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define n9 c += txColor*Sprite3x5(31695.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define DOT c += txColor*Sprite3x5(2.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define COLON c += txColor*Sprite3x5(1040.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define PLUS c += txColor*Sprite3x5(1488.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define DASH c += txColor*Sprite3x5(448.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define LPAREN c += txColor*Sprite3x5(10530.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define RPAREN c += txColor*Sprite3x5(8778.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define _ cpos.x += 4.;if(cpos.x > 61.) slashN
#define BLOCK c += txColor*Sprite3x5(32767.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define QMARK c += txColor*Sprite3x5(25218.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define EXCLAM c += txColor*Sprite3x5(9346.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define EQUAL c += txColor*Sprite3x5(3640.,floor(p-cpos));cpos.x += 4.;if(cpos.x > 61.) slashN
#define COMMA c += txColor*Sprite3x5(4.+16.,floor(p-cpos));cpos.x += 3.;if(cpos.x > 61.) slashN
#define ASTPHB c += txColor*Sprite3x5(25856.,floor(p-cpos));cpos.x += 3.;if(cpos.x > 61.) slashN
#define getBit(num,bit) float(mod(floor(floor(num)/pow(2.,floor(bit))),2.) == 1.0)
#define Sprite3x5(sprite,p) getBit(sprite,(2.0 - p.x) + 3.0 * p.y) * float(all(lessThan(p,vec2(3,5))) && all(greaterThanEqual(p,vec2(0,0))))

void main( void ) {
	goTYPE ;
	
	slashN ;
	
	T R I S H H A C K A N I G G A
	B I T C H M O T H A F U C K A
	I C H L E B L E I N D A K A F U
	C K I N M U R D A I N Y O M O
	M S A N U S G E T T I N D A O 
	R G A S M
		
	goPRINT ;
}
