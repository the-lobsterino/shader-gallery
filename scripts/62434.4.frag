#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

/**
return value from -1.0 to 1.0
*/
float randFloat(int x){
	x+=14150;
	x*=x*4112 + x/268435456 + x/1048576;
	x*=x*1920 + x/2097152 - x/33554432;
	x*=x*33555456 + x/4194304 + x/128;
	return float(x)*4.656612873077393e-10;
}

void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution.xy;
	vec3 color=vec3(0);
	vec3 dcolor=vec3(1,0,0);
	for(int i=0;i<12;i++){
		vec2 p1 = cos(time*vec2(randFloat(i*16+0),randFloat(i*16+1))+vec2(randFloat(i*16+2),randFloat(i*16+3)));
		vec2 p2 = cos(time*vec2(randFloat(i*16+4),randFloat(i*16+5))+vec2(randFloat(i*16+6),randFloat(i*16+7)));
		vec2 p3 = cos(time*vec2(randFloat(i*16+8),randFloat(i*16+9))+vec2(randFloat(i*16+10),randFloat(i*16+11)));
		vec2 p4 = cos(time*vec2(randFloat(i*16+12),randFloat(i*16+13))+vec2(randFloat(i*16+14),randFloat(i*16+15)));
		float pxy=p.x*p.y;
		vec2 b= p1*(1.0-p.x-p.y+pxy)
			+p2*(p.x-pxy)
			+p3*(p.y-pxy)
			+p4*pxy;
		p+=b*0.1;
		color+=dcolor*float(mod(length(p-0.5)*4.0+time*randFloat(i*72+34),1.0)<0.5);
		dcolor=dcolor.zxy;
	}
	gl_FragColor = vec4( vec3( color/4.0), 1.0 );
}