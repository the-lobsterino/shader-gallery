#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define DIV 27.

void main( void ) {
	vec2 p=(gl_FragCoord.xy*2.- resolution)/resolution.y;
	float si=sin(time),co=cos(time);
	p*=mat2(si,co,-co,si);
	vec3 col=vec3(0);
	float d=floor(length(p)*39.)*.02479+.009;
	float a=50.15/DIV;
	float t=time/d/d/d*2.005;
	for(float i=.0;i<DIV;++i){
		t+=a;
		vec2 q=p+vec2(cos(t),sin(t))*d;
		col+=length(q)<.05?9.:.01*t*0.1;
		col*=mix(vec3(.9,.9,.9),vec3(1,.8,.3),float(i)/DIV);
	}
	col*=mix(vec3(5,.9,9),vec3(.05,.9,9),d);
	gl_FragColor = vec4(col,1);
}