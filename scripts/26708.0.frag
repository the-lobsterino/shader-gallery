// halomasta plays goldeneye:
// https://youtu.be/kRw48LZx2oA?t=1582


// the legend of the rubble-baby
// who tried to play a PC shooter, goldeneye
// but got trolled, tenderly
// and cried vulgarly in his rage
// 'fuck you, jew nigger'

// this one is for all of those
// who have encountered a foul-mouthed kid
// when playing online games


































// what, game over?!?!


// From ST mr Elias
// For Glslsandbox by Gigatron




#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float lineWidth = 0.02;
float border = 0.05;
float scale = 0.07;
float t = time*1.4;



// Letter code (https://dl.dropboxusercontent.com/u/14645664/files/glsl-text.txt)
float line(vec2 p, vec2 s, vec2 e) {s*=scale;e*=scale;float l=length(s-e);vec2 d=vec2(e-s)/l;p-=vec2(s.x,-s.y);p=vec2(p.x*d.x+p.y*-d.y,p.x*d.y+p.y*d.x);return length(max(abs(p-vec2(l/2.0,0))-vec2(l/2.0,lineWidth/2.0),0.0))-border;}

float A(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));return d;}

float B(vec2 p){float d=1.0;d=min(d,line(p,vec2(4,5),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));return d;}

float C(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float D(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(4,8)));d=min(d,line(p,vec2(4,8),vec2(4.5,7.5)));d=min(d,line(p,vec2(4.5,7.5),vec2(5,6.25)));d=min(d,line(p,vec2(5,6.25),vec2(5,3.75)));d=min(d,line(p,vec2(5,3.75),vec2(4.5,2)));d=min(d,line(p,vec2(4.5,2),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));return d;}

float E(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float F(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(1,8)));return d;}

float G(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,2.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(3.5,5)));return d;}

float H(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,8)));return d;}

float I(vec2 p){float d=1.0;d=min(d,line(p,vec2(1.5,1.5),vec2(4.5,1.5)));d=min(d,line(p,vec2(4.5,1.5),vec2(3,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(1.5,8)));d=min(d,line(p,vec2(1.5,8),vec2(4.5,8)));return d;}

float J(vec2 p){float d=1.0;d=min(d,line(p,vec2(1.5,8),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(4,7)));d=min(d,line(p,vec2(4,7),vec2(4,1.5)));d=min(d,line(p,vec2(4,1.5),vec2(1.5,1.5)));return d;}

float K(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(2.5,5)));d=min(d,line(p,vec2(2.5,5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(2.5,5)));d=min(d,line(p,vec2(2.5,5),vec2(5,8)));return d;}

float L(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float M(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(3,4)));d=min(d,line(p,vec2(3,4),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,8)));return d;}

float N(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float O(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float P(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));return d;}

float Q(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,8),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(3.5,6.5)));return d;}

float R(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,8),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(3.5,5)));d=min(d,line(p,vec2(3.5,5),vec2(5,8)));return d;}

float S(vec2 p){float d=1.0;d=min(d,line(p,vec2(5,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(1,5)));d=min(d,line(p,vec2(1,5),vec2(5,5)));d=min(d,line(p,vec2(5,5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(1,8)));return d;}

float T(vec2 p){float d=1.0;d=min(d,line(p,vec2(3,8),vec2(3,1.5)));d=min(d,line(p,vec2(3,1.5),vec2(1,1.5)));d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));return d;}

float U(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float V(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(5,1.5)));return d;}

float W(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(3,6)));d=min(d,line(p,vec2(3,6),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(5,1.5)));return d;}

float X(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,8)));d=min(d,line(p,vec2(5,8),vec2(3,4.75)));d=min(d,line(p,vec2(3,4.75),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(1,8)));return d;}

float Y(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(3,8)));d=min(d,line(p,vec2(3,8),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(5,1.5)));return d;}

float Z(vec2 p){float d=1.0;d=min(d,line(p,vec2(1,1.5),vec2(5,1.5)));d=min(d,line(p,vec2(5,1.5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1.5,5)));d=min(d,line(p,vec2(1.5,5),vec2(4.5,5)));d=min(d,line(p,vec2(4.5,5),vec2(3,5)));d=min(d,line(p,vec2(3,5),vec2(1,8)));d=min(d,line(p,vec2(1,8),vec2(5,8)));return d;}

float Astroph(vec2 p){float d=1.0;d=min(d,line(p,vec2(1.5,1.5),vec2(2.5,0.7)));return d;}

void main()
{	
	vec2 uv = (gl_FragCoord.xy - resolution.xy) / resolution.yy+0.7;
	uv.x += 0.15;
	
	uv.x *= 4.;//abs(sin(uv.x+t*2.0+22.0)*0.7+4.4);
	uv.y *= 4.;//abs(sin(uv.x+t*2.0)+2.2)+1.0;
	
	vec3 col = vec3(uv.y)*vec3(0.0,0.0, 0.0);
	float d = 1.0;
	
	vec2 w = vec2(-.45, 0);
	vec2 h = vec2(0, -.75);
	
	float x = 0.0;
	float y = 0.0;
	vec2 line = vec2(-3., 1.75);
	
	
	
	line += h;
	x = 1.;
	d = min(d,B(uv-line+ w*(x++)));
	d = min(d,I(uv-line+ w*(x++)));
	d = min(d,G(uv-line+ w*(x++)));
	x++;
	d = min(d,B(uv-line+ w*(x++)));
	d = min(d,U(uv-line+ w*(x++)));
	d = min(d,T(uv-line+ w*(x++)));
	d = min(d,T(uv-line+ w*(x++)));
	d = min(d,S(uv-line+ w*(x++)));
	
	
	float wd = .1*sin(time*22.)+.1;
	col = mix(vec3(1,uv.y,0),col,smoothstep(lineWidth-wd,lineWidth+wd,d));

	gl_FragColor = vec4(col*vec3(40.*abs(d)),1.0);
}