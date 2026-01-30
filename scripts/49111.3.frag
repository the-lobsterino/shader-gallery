#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//based on i.q(Inigo Quilez) eye shader


float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise3 (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float fbm(vec2 p){
	float f=0.0;
	float am=0.5;//+0.5*abs(cos(time));
	float fq=2.0;
	float ii=0.1;//sin(time);
	for(int i=0;i<8;i++){
		f+=(am*noise3(p));
		am=am/2.0;
		p=p*(2.0+ii);
		ii+=0.1;
	}
	
	
	return f;
	


}


vec3 c1(vec2 pos, vec2 dis, float con1, float con2){
	pos+=dis;
	float r=sqrt(dot(pos,pos));
	float a=atan(pos.y, pos.x);
	
	float f=.0210;
		
	vec3 color=vec3(f*5.0);
	f=fbm(vec2(con1*r, con2*a));
	color=mix(color, vec3(0.0, 0.2, 1.0),f);
	
	if(r>0.44){
		color=vec3(0.0);
	}
	
	return color;

}

void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	vec3 color=vec3(0.0);
	
	color+=c1(pos, vec2(0.5), 88.10, 2.10);
	color+=c1(pos, vec2(-0.5), 4.10, 80.10);
	color+=c1(pos, vec2(-0.5, 0.5), 20.10, 8.10);
	color+=c1(pos, vec2(0.5,- 0.5), 4.10, 1.10);
	
	
	gl_FragColor=vec4(color, 1.0);
	
	
}