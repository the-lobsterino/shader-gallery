#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define A 0.75
#define B 2.0
#define WSCALE 3.0
#define MNUM 30


void main( void ) {
	float yuragi;
	float dist;
	vec3 c = vec3(0.);
	float its = 0.0;
	vec2 p=vec2(gl_FragCoord.x,gl_FragCoord.y)/min(resolution.x,resolution.y)*WSCALE/2.0;//-1~+1の座標系
	for(int i = 0; i< MNUM; i++){
		float fi = float(i);
		float fnum=float(MNUM);
		vec2 o = vec2(fi/fnum*WSCALE,WSCALE*fract(A*time)+sin(fi));
		dist=length(p-o);
		yuragi =sin(10.*time*(1.+fi/fnum));
		its += 0.0005*yuragi
			 *(1.0/(pow(p.x-o.x,abs(.2*yuragi)))+1.0/(pow(p.y-o.y,abs(.2*yuragi))))
			 *max(1.0/dist-2.0,0.0);
		
		//its += 0.0001 / pow(dist,2.0)*yuragi;
		//its = min(its,1.0);
		c += its * vec3(1.0,1.0,0.6);
	}
	vec4 tail = texture2D(backbuffer, gl_FragCoord.xy/resolution.xy)*0.4;
	gl_FragColor = vec4(c,1.)+tail;
}