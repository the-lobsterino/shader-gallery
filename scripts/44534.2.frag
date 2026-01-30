#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define CURSOR iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
#define LETTER(var, img) int var[16]; convert(Letter img, var);

#define _1  QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _2  QQQQQQQQQQQQQQzzzQQQQQQQzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _3  QQQQQQQQQQQQQzzzzzzzQzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQzzQQQQQQQQQQQQQQQQQQQQQzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _4  QQQQQQQQQQQQzzzzzzzzzzzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _5  QQQQQQQQQQQQzzzzzzzzzzzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _6  QQQQQQQQQQQQQzzzzzzzzzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _7  QQQQQQQQQQQQQQzzzzzzzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _8  QQQQQQQQQQQQQQQzzzzzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQzzzzzzzzzzQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _9  QQQQQQQQQQQQQQQQzzzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _10 QQQQQQQQQQQQQQQQQzzzzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _11 QQQQQQQQQQQQQQQQQQzzzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _12 QQQQQQQQQQQQQQQQQQQzzzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
#define _13 QQQQQQQQQQQQQQQQQQQQzQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ

struct Letter {
	int _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
};

#define NEXT(index, _index) b[index-1] = a._index;
	
void convert(Letter a, out int b[16]) {
	NEXT(1, _1); NEXT(2, _2); NEXT(3, _3); NEXT(4, _4);
	NEXT(5, _5); NEXT(6, _6); NEXT(7, _7); NEXT(8, _8);
	NEXT(9, _9); NEXT(10, _10); NEXT(11, _11); NEXT(12, _12);
	NEXT(13, _13); NEXT(14, _14); NEXT(15, _15); NEXT(16, _16);
}

float write(int letter[16], inout vec2 cur) {
	
	vec2 pos = gl_FragCoord.xy / resolution.y; // écran de PC: x appartient à [0, >1], y appartient à [0, 1]
	pos.y = 1.0 - pos.y;
	
	float xmax = resolution.x / resolution.y;
	float size = xmax / 80.0;
	
	float c = 0.0;
	bool finish = false;
	
	for(int i = 0; i < 4; ++i) {
		
		for(int j = 0; j < 4; ++j) {
			
			if(letter[j*4 + i] == 0) {
				continue;
			}
			
			float x = float(i);
			float y = float(j);
			
			if(pos.x >= cur.x + x*size && pos.x <= cur.x + (x+1.0)*size && pos.y >= cur.y + y*size && pos.y <= cur.y + (y+1.0)*size) {
			
				finish = true;
				c = 0.3;
				break;
			}
		}
		
		if(finish) break;
	}
	
	cur.x += 0.1;
	cur.y += 0.04;
	
	return c;
}

#define WRITE(HAHAHAHAHAHHAAHAHAHAHAH) c += write(HAHAHAHAHAHHAAHAHAHAHAH, CURSOR);
#define J WRITE(J_)
#define U WRITE(U_)
#define L WRITE(L_)
#define I WRITE(I_)
#define E WRITE(E_)
#define T WRITE(T_)

#define _ c += coeur()

#define INSIDE(r, x, y) (((x)*(x) + (y)*(y)) <= (r)*(r))
#define OR ||
#define OU OR

/////////////////////////////////////////////////////////////////////////////////
//////// FROM https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle

#define fPoint vec2

float sign (fPoint p1, fPoint p2, fPoint p3)
{
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool PointInTriangle (fPoint pt, fPoint v1, fPoint v2, fPoint v3)
{
    bool b1, b2, b3;

    b1 = sign(pt, v1, v2) < 0.0;
    b2 = sign(pt, v2, v3) < 0.0;
    b3 = sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}

////////////////////////////////////////////////////////////////////////////////////


float coeur() {
	
	vec2 pos = gl_FragCoord.xy / resolution.y; // écran de PC: x appartient à [0, >1], y appartient à [0, 1]
	pos.y = 1.0 - pos.y;
	
	vec2 center = vec2(1.2, 0.35);
	float c = 0.0;
	float r = 0.05;
	
	float x = pos.x - center.x;
	float y = pos.y - center.y;
	vec2 p1 = vec2(center.x + 0.15, center.y), p2 = vec2(center.x - 0.05, center.y), p3 = vec2(center.x + 0.05, 0.45);
		
	if(INSIDE(r, x - 0.1, y) OU INSIDE(r, x, y) OU PointInTriangle(pos, p1, p2, p3)) {
		c = 1.0;
	}
	
	return c;
}

void main(void) {
	
	LETTER(J_,(
		0,1,1,0,
		0,0,1,0,
		0,0,1,0,
		1,1,1,0
	));
	
	LETTER(U_,(
		1,0,0,1,
		1,0,0,1,
		1,0,0,1,
		1,1,1,1
	));
	
	LETTER(L_,(
		1,0,0,0,
		1,0,0,0,
		1,0,0,0,
		1,1,1,0
	));
	
	LETTER(I_,(
		1,1,1,0,
		0,1,0,0,
		0,1,0,0,
		1,1,1,0
	));
	
	LETTER(E_,(
		1,1,1,0,
		1,0,0,0,
		1,0,0,0,
		1,1,1,0
	));
	
	LETTER(T_,(
		1,1,1,0,
		0,1,0,0,
		0,1,0,0,
		0,1,0,0
	));
	
	float c;
	vec2 CURSOR = vec2(0.1, 0.2);
	
	J U L I E T
	
	;_;
		
		
	gl_FragColor = vec4(0.0, c, 0.0, 1.0);
}