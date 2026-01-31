#extension GL_OES_standard_derivatives : enable
//r33v01v3 2023

precision highp float;

uniform float time;
uniform vec2 resolution;
	

	
vec3 col = vec3(0.0);//main colour out
vec3 grid = vec3(0.0);//grid
vec3 line = vec3(0.0);//grid
vec3 circ = vec3(0.0);//circle
vec3 sweep = vec3(0.0);//sweep
vec3 targets = vec3(0.0);//targets
vec3 ggrn = vec3(0.0,0.1,0.0);//grid green
vec3 lgrn = vec3(0.0,1.0,0.0);//line green

float dline(vec2 p,vec2 a,vec2 b ){
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float circle(vec2 p, float r){
	float d1 = smoothstep(0.2,0.195,length(p)-r);
	float d2 = smoothstep(0.2,0.195,length(p)-r*0.96);
	return d1-d2;
}

float dot(vec2 p, float r){
	float d = smoothstep(0.008,0.003,length(p)-r);
	
	return d;
}


void main( void ) {

	vec2 uv = (( gl_FragCoord.xy )-0.5*resolution)/ resolution.y;
	float t = time;
	vec2 guv = uv;
	vec2 gmask = uv;
	vec2 luv = uv;
	vec2 pc = uv;
	float s = sin(t);
	float c = cos(t);
	mat2 rot =  mat2(c,-s,s,c);
	vec2 guv2 = fract(guv*20.0)-0.5;
	if (guv2.x > 0.46 || guv2.y > 0.46) grid = ggrn;
	float gd = smoothstep(0.37,0.0,length(gmask));
	grid *= gd;
	pc *= rot;
	pc = vec2(atan(pc.x,pc.y),length(pc));
	sweep = vec3(pc.x/6.2831);
	sweep *= smoothstep(0.4,0.0,length(gmask));
	sweep *= ggrn*2.0;
	vec3 tsweep = vec3(0.2+pc.x/6.2831);
	tsweep *= smoothstep(0.4,0.0,length(gmask));
	luv *= rot;
	float ld = dline(luv, vec2(0.0), vec2(0.0, -0.33));
	float ld1 = smoothstep(0.02, 0.0, ld);
	line += ld1*lgrn*0.4;
	ld1 = smoothstep(0.003, 0.0, ld);
	line += ld1;
	col = min(sweep*0.3,grid);
	col += max(col,line);
	col += max(sweep,col);
	col += smoothstep(0.006,0.0,length(vec2(luv.x,luv.y+0.33)));
	circ = circle(uv,0.15)*lgrn;
	col = max(col,circ);
	col += smoothstep(0.01,0.0,length(uv));
	float dot1 = dot(vec2(uv.x-0.2,uv.y+0.03),0.001);
	dot1 += dot(vec2(uv.x+0.02,uv.y+0.3),0.001);
	dot1 += dot(vec2(uv.x+0.1,uv.y-0.1),0.001);
	targets += min(vec3(dot1),tsweep*8.0)*lgrn;
	col += max(sweep,targets);
	
	gl_FragColor = vec4(col, 1.0);

}