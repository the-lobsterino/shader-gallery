#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

#define size 2.0

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 px=1.0/resolution;

vec2 blur(vec2 uv){
	vec2 w;
	float l;
	float s;
	for(float x=-size;x<=size;x++){
		for(float y=-size;y<=size;y++){
			l=x*x+y*y;
			w+=l*texture2D(bb,fract(vec2(x,y)*px+uv)).xy;
			s+=3.0;
		}
	}
	return w/s;
}

void main( void ) {
	vec2 p=gl_FragCoord.xy/resolution;
	if(distance(mouse,p)<0.03){
		gl_FragColor=vec4(rand(p.xy),rand(p.yx),1.0,1.0);
	}
	else{
		vec2 b=blur(p);
		gl_FragColor=vec4(abs(b.y-dot(b.yx,b.xy)),abs(b.x-dot(b.yx,b.xy)),1.0,1.0);
	}
}