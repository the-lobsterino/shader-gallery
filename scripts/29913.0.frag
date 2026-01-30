#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define l 40
#define m 0.95
void main(void){
	vec2 v = (gl_FragCoord.xy - resolution/2.0) / min(resolution.y,resolution.x) * 20.0;
	vec2 vv = v; vec2 vvv = v;
	float tm = time*0.01;
	vec2 mspt = (vec2(
			sin(tm)+cos(tm*0.2)+sin(tm*0.5)+cos(tm*-0.4)+sin(tm*1.3),
			cos(tm)+sin(tm*0.1)+cos(tm*0.8)+sin(tm*-1.1)+cos(tm*1.5)
			)+1.0)*0.35; //5x harmonics, scale back to [0,1]
	float R = 0.0;
	float RR = 0.0;
	float RRR = 0.0;
	float a = (1.-mspt.x)*0.5;
	float C = cos(time*0.01+a*0.1);
	float S = sin(time*0.01+a*0.1);
	vec2 xa=vec2(C, -S);
	vec2 ya=vec2(S, C);
	vec2 shift = vec2( 0.04, 0.3);
	float Z = 1.0 + mspt.y*0.4;
	for ( int i = 0; i < l; i++ ){
		float r = dot(v,v);
		if ( r > 1.0 )
		{
			r = (1.0)/r ;
			v.x = v.x * r;
			v.y = v.y * r;
		}
		R *= m;
		R += r;
		if(i < l-1){
			RR *= m;
			RR += r;
			if(i < l-2){
				RRR *= m;
				RRR += r;
			}
		}
		
		v = vec2( dot(v, xa), dot(v, ya)) * Z + shift;
	}
	float c = ((mod(R,2.0)>1.0)?1.0-fract(R):fract(R));
	float cc = ((mod(RR,2.0)>1.0)?1.0-fract(RR):fract(RR));
	float ccc = ((mod(RRR,2.0)>1.0)?1.0-fract(RRR):fract(RRR));
	gl_FragColor = vec4(ccc, cc, c, 1.0); 
}