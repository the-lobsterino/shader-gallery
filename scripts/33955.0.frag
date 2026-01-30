#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi=3.1415926535;
float rand(float n) {return fract(sin(n)*43758.5453123);}
float f(vec2 a,float t) {return abs(sin(atan(a.x,a.y)))/pow(length(a),t);}
//shemale
void main(void) {
	vec2 uv = ((gl_FragCoord.xy*2.)/resolution)/0.5 ;uv.x -= 2.;
	float a=sin(time*5.)*5.+6.;
	bool b=f(uv,a)<0.9;
	if(abs(uv.x)<.3+(sin(time*7.)/1e2)&&b){b=f(uv,a)>0.7;}
	vec2 c=vec2(uv.x,(1.8-uv.y)+(sin(time*5.)*.05))*3.;
	if(f(c,4.)>.7||uv.y>(c.y+2.)){b = f(c,4.+(sin(time*5.)*uv.y))<.9;}
	const float l=10.;float f=1.;
	for(float i=0.;i<l;i++){
		float p=(time*.6)+rand(i);
		f*=length(uv-vec2((rand(floor(p))-.5)*fract(p),1.5+(sin(fract(p)*pi)*2.)));
	}
	f*=l;
	bool shemaleCum=f<0.01;
	
	vec2 uv2 = gl_FragCoord.xy / resolution.xy;

	float clr=-((0.3-abs(uv2.x-.5))+(cos(uv2.y*pi*2.)/29.));
	clr = min(
		length(
			vec2(abs(uv2.x-.5)-.2,(uv2.y-.8) - (0.01 * sin(time*6.0))))-.25- (0.001 * sin(time*6.0)),clr);
	clr = -min(
		length(
			vec2(
				abs(uv2.x-.5)-.3,(uv2.y-.8)- (0.01 * sin(time*6.0))))-.06,-clr);
	clr *= gl_FragCoord.y / 9000.0;
	vec3 color = vec3(mix(vec3(1.,.7,.5),vec3(.8,0.,.4),clamp(clr*(4000. - (2000. * sin(time))),0.1,1.)));
	
	
	if(b){gl_FragColor=vec4(shemaleCum);}else{gl_FragColor=vec4(.9,1.-uv.y/2.,.5,1);}
	gl_FragColor = (gl_FragColor * 0.5) + vec4(color, 1.0);
}