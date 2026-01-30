#ifdef GL_ES
precision mediump float;
#endif

// traditional 90's blur'n'fire trick fx
// -initial version by deepr 2014/03/17
// 69 lines of fire

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define PI 3.141592

// google glsl rand gave this, thanks and credit flies to
// http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	
	vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
	vec2 t = vec2(gl_FragCoord.xy / resolution);
	
	float fr=1.01;
	float fg=1.01;
	float fb=1.01;
	
	float tx = time*0.000001;
	
	
	// generate some fire seeds somewhere into the screen
	vec3 base = vec3(rand(p.xy*fr+tx), rand(p.xy*fg+tx), rand(p.xy*fb+tx));	
	float limitMinGen = 0.15;
	float genGain = 0.50;
	float limitPosY = 0.5-0.051+rand(p.xy*0.0000001)*0.021+0.051*sin(cos(p.x*10.0+p.y*2.0+time)+time*0.23);
	base *= (clamp(base, limitMinGen, 1.0)-limitMinGen)*(1.0/(1.0-limitMinGen))*genGain;
	base *= (clamp(-(p.y+limitPosY)*32.0, 0.0, 1.0)-0.0);
	
        float fcr = 1.5+0.2*sin(time*1.0+p.x*0.40+p.y*12.32);
	float fcg = 1.3;
	float fcb = 1.0;
	float fmo = 0.01;
	base = vec3(base.r*fcr, base.g*fcg, base.b*fcb)/(max(fcr,max(fcg,fcb))-fmo);
	
	// blur'n'fire
	float fc = 0.0;
	float fe = 0.5+0.0*cos(sin(p.x*1.4+cos(p.y*2.5+time*2.12))+time*2.534)*0.08-0.04;
	vec2 tc = gl_FragCoord.xy/resolution.xy;
	vec3 r = texture2D(backbuffer, tc).rgb*fc;
	float sx = 1.20/resolution.x;
	float sy = 1.20/resolution.y;
	float vo = 2.5;
	r += texture2D(backbuffer, tc+vec2(1.0*sx, 0.0*sy-vo*sy)).rgb*fe;
	r += texture2D(backbuffer, tc+vec2(-1.0*sx, 0.0*sy-vo*sy)).rgb*fe;
	r += texture2D(backbuffer, tc+vec2(0.0*sx, 1.0*sy-vo*sy)).rgb*fe;
	r += texture2D(backbuffer, tc+vec2(0.0*sx, -1.0*sy-vo*sy)).rgb*fe;		
	
	vec3 c = r*0.50+base;
	
	float gr = 1.50+0.150*sin(time*1.0+p.x*0.40+p.y*12.32);
	float gg = 1.30;
	float gb = 1.0;
	float mo = 0.01;
	c = vec3(c.r*gr, c.g*gg, c.b*gb)/(max(gr,max(gg,gb))-mo);
	
	gl_FragColor = vec4(c, 1);
}