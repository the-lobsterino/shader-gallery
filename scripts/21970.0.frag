// Glitchy Mario by cx20

precision mediump float;

// compatible macro for #js4kintro 
#define r resolution
#define t time

uniform vec2 r;
uniform float t;

// add) B >= C && B < (C+16)
#define F(A,B,C,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p)A=B>=C&&B<(C+16)?B==(C+0)?a:B==(C+1)?b:B==(C+2)?c:B==(C+3)?d:B==(C+4)?e:B==(C+5)?f:B==(C+6)?g:B==(C+7)?h:B==(C+8)?i:B==(C+9)?j:B==(C+10)?k:B==(C+11)?l:B==(C+12)?m:B==(C+13)?n:B==(C+14)?o:B==(C+15)?p:A:A

#define U vec3(0.0,1.0,0.0)
#define V vec3(1.0,0.8,0.8)
#define W vec3(0.5,0.0,0.0)
#define X vec3(1.0,0.0,0.0)
#define Y vec3(1.0,1.0,0.0)
#define Z vec3(0.0,0.0,1.0)
#define _ vec3(0.)

// Random number used by 2D noise function...
float random(vec2 ab) 
{
	float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
	return fract(f);
}

void main() {
	vec3 m0 = vec3(0.0);
	for ( int j = 0; j < 3; j++ ) {
		vec2 p = gl_FragCoord.xy/r.xy;
		if ( j == 0 ) { p.x += random(vec2(sin(t))) * 0.03; }
		if ( j == 1 ) { p.y += random(vec2(cos(t))) * 0.05; }
		if ( j == 2 ) { p += random(vec2(sin(t))) * 0.02; }
		vec3 m = vec3(0.0);

		float x = floor(p.x * 16.0);
		float y = floor((1.0 - p.y) * 16.0);
		int i = int(x + y * 16.0);
		
		F(m,i,  0,_,_,_,_,_,_,_,_,_,_,_,_,_,V,V,V);
		F(m,i, 16,_,_,_,_,_,_,X,X,X,X,X,_,_,V,V,V);
		F(m,i, 32,_,_,_,_,_,X,X,X,X,X,X,X,X,X,V,V);
		F(m,i, 48,_,_,_,_,_,W,W,W,V,V,W,V,_,X,X,X);
		F(m,i, 64,_,_,_,_,W,V,W,V,V,V,W,V,V,X,X,X);
		F(m,i, 80,_,_,_,_,W,V,W,W,V,V,V,W,V,V,V,X);
		F(m,i, 96,_,_,_,_,W,W,V,V,V,V,W,W,W,W,X,_);
		F(m,i,112,_,_,_,_,_,_,V,V,V,V,V,V,V,X,_,_);
		F(m,i,128,_,_,X,X,X,X,X,Z,X,X,X,Z,X,_,_,_);
		F(m,i,144,_,X,X,X,X,X,X,X,Z,X,X,X,Z,_,_,W);
		F(m,i,160,V,V,X,X,X,X,X,X,Z,Z,Z,Z,Z,_,_,W);
		F(m,i,176,V,V,V,_,Z,Z,X,Z,Z,Y,Z,Z,Y,Z,W,W);
		F(m,i,192,_,V,_,W,Z,Z,Z,Z,Z,Z,Z,Z,Z,Z,W,W);
		F(m,i,208,_,_,W,W,W,Z,Z,Z,Z,Z,Z,Z,Z,Z,W,W);
		F(m,i,224,_,W,W,W,Z,Z,Z,Z,Z,Z,Z,_,_,_,_,_);
		F(m,i,240,_,W,_,_,Z,Z,Z,Z,_,_,_,_,_,_,_,_);
		
		if ( j == 0 ) { m.x = m.x; m.y = 0.0; m.z = 0.0; }
		if ( j == 1 ) { m.x = 0.0; m.y = m.y; m.z = 0.0; }
		if ( j == 2 ) { m.x = 0.0; m.y = 0.0; m.z = m.z; }
		m0 += m;
	}

	gl_FragColor = vec4(m0, 1.0);
}