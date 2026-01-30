
 
#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
 
 
#define Resolution              resolution
#define Time                    time
#define HorizontalAmplitude     0.40
#define VerticleAmplitude       0.20
#define HorizontalSpeed         0.90
#define VerticleSpeed           1.50
#define ParticleMinSize         1.80
#define ParticleMaxSize         1.9
#define ParticleBreathingSpeed      0.30
#define ParticleColorChangeSpeed    0.70
#define ParticleCount           2.0
#define ParticleColor1          vec3(9.0, 5.0, 3.0)
#define ParticleColor2          vec3(1.0, 3.0, 9.0)
#define font_size 20. 
#define font_spacing .05
#define A_ vec2(0.,0.)
#define B_ vec2(1.,0.)
#define C_ vec2(2.,0.)
#define D_ vec2(0.,1.)
#define E_ vec2(1.,1.)
#define F_ vec2(2.,1.)
#define G_ vec2(0.,2.)
#define H_ vec2(1.,2.)
#define I_ vec2(2.,2.)
#define J_ vec2(0.,3.)
#define K_ vec2(1.,3.)
#define L_ vec2(2.,3.)
#define M_ vec2(0.,4.)
#define N_ vec2(1.,4.)
#define O_ vec2(2.,4.)
#define P_ vec2(0.,5.)
#define Q_ vec2(1.,5.)
#define R_ vec2(1.,5.)
#define S_ vec2(0.,6.)
#define T_ vec2(1.,6.)
#define U_ vec2(2.0,6.)
#define A(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,J_,p) + t(J_,L_,p)
#define B(p) t(A_,M_,p) + t(M_,O_,p) + t(O_,I_, p) + t(I_,G_,p)
#define C(p) t(I_,G_,p) + t(G_,M_,p) + t(M_,O_,p) 
#define D(p) t(C_,O_,p) + t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p)
#define E(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,L_,p) + t(L_,J_,p)
#define F(p) t(C_,B_,p) + t(B_,N_,p) + t(G_,I_,p)
#define G(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,U_,p) + t(U_,S_,p)
#define H(p) t(A_,M_,p) + t(G_,I_,p) + t(I_,O_,p) 
#define I(p) t(E_,E_,p) + t(H_,N_,p) 
#define J(p) t(E_,E_,p) + t(H_,T_,p) + t(T_,S_,p)
#define K(p) t(A_,M_,p) + t(M_,I_,p) + t(K_,O_,p)
#define L(p) t(B_,N_,p)
#define M(p) t(M_,G_,p) + t(G_,I_,p) + t(H_,N_,p) + t(I_,O_,p)
#define N(p) t(M_,G_,p) + t(G_,I_,p) + t(I_,O_,p)
#define O(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,G_,p)
#define P(p) t(S_,G_,p) + t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p)
#define Q(p) t(U_,I_,p) + t(I_,G_,p) + t(G_,M_,p) + t(M_,O_, p)
#define R(p) t(M_,G_,p) + t(G_,I_,p)
#define S(p) t(I_,G_,p) + t(G_,J_,p) + t(J_,L_,p) + t(L_,O_,p) + t(O_,M_,p)
#define T(p) t(B_,N_,p) + t(N_,O_,p) + t(G_,I_,p)
#define U(p) t(G_,M_,p) + t(M_,O_,p) + t(O_,I_,p)
#define V(p) t(G_,J_,p) + t(J_,N_,p) + t(N_,L_,p) + t(L_,I_,p)
#define W(p) t(G_,M_,p) + t(M_,O_,p) + t(N_,H_,p) + t(O_,I_,p)
#define X(p) t(G_,O_,p) + t(I_,M_,p)
#define Y(p) t(G_,M_,p) + t(M_,O_,p) + t(I_,U_,p) + t(U_,S_,p)
#define Z(p) t(G_,I_,p) + t(I_,M_,p) + t(M_,O_,p)
#define g(p) t(A_,G_,p) + t(G_,M_,p) + t(M_,O_,p) + t(C_,F_,p) + t(C_,A_,p)+ t(O_,I_,p)+ t(I_,H_,p)
#define i(p) t(E_,K_,p) + t(N_,N_,p) 


vec2 caret_origin = vec2(3.0, .7);
vec2 caret;

//-----------------------------------------------------------------------------------
float minimum_distance(vec2 v, vec2 w, vec2 p_)
{	
  	float l2 = (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y); 
  	if (l2 == 0.0) {
		return distance(p_, v);  
	}
	
  	float t = dot(p_ - v, w - v) / l2;
  	if(t < 0.0) {
		
		return distance(p_, v);
	} else if (t > 1.0) {
		return distance(p_, w);  
	}
  	vec2 projection = v + t * (w - v);  
	return distance(p_, projection);
}


//-----------------------------------------------------------------------------------
float textColor(vec2 from, vec2 to, vec2 p_)
{
	p_ *= font_size;
	float inkNess = 0., nearLine, corner, strokeWidth = 0.05; 
	nearLine = minimum_distance(from,to,p_); 
	inkNess += smoothstep(0., 6., 1.- 50.*(nearLine - strokeWidth)); 
	inkNess += smoothstep(0., 2.5, 1.- (nearLine  + 5. * strokeWidth));
	return inkNess;
}

//-----------------------------------------------------------------------------------

vec2 grid(vec2 letterspace) 
{
	return ( vec2( (letterspace.x / 2.) * .65 , 1.0-((letterspace.y / 2.) * 1.5) ));
}

//-----------------------------------------------------------------------------------

float count = 0.0;
float t(vec2 from, vec2 to, vec2 p_) 
{
	count++;
	if (count > time*20.0) return 0.0;
	return textColor(grid(from), grid(to), p_);
}

//-----------------------------------------------------------------------------------
vec2 r()
{
	vec2 pos = gl_FragCoord.xy/resolution.xy;
	pos.y -= caret.y;
   	pos.x -= font_spacing*caret.x;
	return pos;
}

//-----------------------------------------------------------------------------------



void add()
{
	caret.x += 1.0;
	
}

//-----------------------------------------------------------------------------------
void space()
{
	caret.x += 1.5;
}

//-----------------------------------------------------------------------------------
void newline()
{
	caret.x = caret_origin.x;
	caret.y -= .28;
}

//-----------------------------------------------------------------------------------




void main( void ) {
    
	
	float d_ = 0.;
	vec3 col = vec3((0.1,0.25,0.02));
	caret_origin = vec2(3.85, .85);
	caret = caret_origin;

	caret.x += 2.0;
	d_ += F(r()); add(); d_ += R(r()); add(); d_ += A(r()); add(); d_ += N(r()); add(); d_ += C(r()); add(); d_ += E(r());space();add(); d_ += i(r());add(); d_ += i(r());
	
	newline();
	d_ += W(r()); add();d_ += E(r()); add();space();d_ += A(r()); add();d_ += R(r()); add();d_ += E(r()); add();space();
	d_ += W(r()); add();d_ += I(r()); add();d_ += T(r()); add();d_ += H(r()); add();
	newline();
	caret.x += 5.30;
	caret.y += .05;
	caret.x += sin(time*2.)-.5 + d_ ;
	
	d_ += Y(r()); add();d_ += O(r());add();d_ += U(r());add();
	
	

    

    float time_ = (time+10.) * 30.0;

    float s = 0.0, v = 0.0;
    vec2 uv = (-resolution.xy + 2.0 * gl_FragCoord.xy ) / resolution;
	float t = time_*0.005;
	uv.x += sin(t) * 0.5;
	float si = sin(t + 2.17); // ...Squiffy rotation matrix!
	float co = cos(t);
	uv *= mat2(co, si, -si, co);
	vec3 col_ = vec3(0.0);
	vec3 init = vec3(0.25, 0.25 + sin(time_ * 0.001) * 0.4, floor(time_) * 0.0008);
	for (int r = 0; r < 100; r++) 
	{
		vec3 p = init + s * vec3(uv, 0.143);
		p.z = mod(p.z, 2.0);
		for (int i=0; i < 10; i++)	p = abs(p * 2.04) / dot(p, p) - 0.75;
		v += length(p * p) * smoothstep(0.0, 0.5, 0.9 - s) * .0005;
		// Get a purple and cyan effect by biasing the RGB in different ways...
		col +=  vec3(v * 0.8, 1.1 - s * 0.5, .7 + v * 0.5) * v * 0.013;
		s += .005;
	
	gl_FragColor = vec4(col, 1.0);
}
	
	
	
	
	
	
	
	
    col += vec3(d_*1.0, d_*2., d_*2.5);
    float t_ = sin(time/2.);

	
    gl_FragColor = vec4( col+col_/t_, 1.0 );
   	
	
}








