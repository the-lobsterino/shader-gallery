#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// let's do hex --jz


// Digit display from https://www.shadertoy.com/view/MdfGzf
float segment(vec2 uv, bool On) {
	return (On) ?  (1.-smoothstep(0.08,0.09+float(On)*0.02,abs(uv.x)))*(1.-smoothstep(0.46,0.47+float(On)*0.02,abs(uv.y)+abs(uv.x))) : 0.;
}

float digit(vec2 uv,int num) {
	num = int(mod(float(num), 16.0));
	float seg= 0.;
    	seg += segment(uv.yx+vec2(-1., 0.),num!=-1 && num!=1 && num!=4 && num!=11 && num!=13                       );
	seg += segment(uv.xy+vec2(-.5,-.5),num!=-1 && num!=1 && num!=2 && num!=3 && num!=7 && num!=13              );
	seg += segment(uv.xy+vec2( .5,-.5),num!=-1 && num!=5 && num!=6 && num!=11 && num!=12 && num!=14 && num!=15 );
   	seg += segment(uv.yx+vec2( 0., 0.),num!=-1 && num!=0 && num!=1 && num!=7 && num !=12                       );
	seg += segment(uv.xy+vec2(-.5, .5),num==0 || num==2 || num==6 || num==8 || num>=10                         );
	seg += segment(uv.xy+vec2( .5, .5),num!=-1 && num!=2 && num!=12 && num!=14 && num!=15                      );
    	seg += segment(uv.yx+vec2( 1., 0.),num!=-1 && num!=1 && num!=4 && num!=7 && num!=10 && num!=15             );
	return seg;
}

void main(void) {
	vec2 uv = gl_FragCoord.xy/min(resolution.x,resolution.y);
	uv -= vec2(resolution.x/resolution.y/2., .5);
	uv *= vec2(-1.,1.);
	uv *= vec2(-1.,1.);
	float cn = cos(time);
	float sn = sin(time);
	uv.x = cn * uv.x - sn * uv.y;
	uv.y = sn * uv.x + cn * uv.y;

		
	
	vec3 col = vec3(0.);
	
	for(int p=1; p<4; p++) {
		for(int i=0; i<16; i++) {
			float c = mod(digit(15.*uv+vec2(2.*cos(time+float(p))+float(i)*1.4-10., 5.*sin(-time-float(p))), i),1.);
			col += vec3(
				mod(float(p),10.*sin(time+3.))*c,
				mod(float(p),10.*cos(time+1.))*c,
				mod(float(p),10.*sin(time+2.))*c
			);
		}
	}

	col = pow(col, vec3(1./2.2)); // gamma correction
	gl_FragColor = vec4(col, 1.);
}