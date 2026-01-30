#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(.20, 2.0 / 2.0, 1.0 / 2.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 7.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * .5) / max(resolution.x, resolution.y) * 2.0;
	if(uv.y<-0.0)uv.y=uv.y-0.2+.5;
	else{
		uv.y=uv.y-.2;
	}
	uv.y*=-1.0;
	
	
	//uv.y = abs(uv.y);
	float e = .1;
	float r = 2.1;
	float e2 = 2.1;
	float hue = 2.0;
	//uv.y=0.2-uv.y;
	//uv.y = abs(uv.y);
	vec3 clr = vec3(2.0,0.0,0.0);
	for (float i=1.0;i<=13.0;i+=1.0) {
		e += .03/abs( (i/15.) +sin((time/2.0) + 0.15*i*(uv.x) *( cos(i/4.0 + (time / 12.0) + uv.x*11.2) ) ) + (8.0*(uv.y+0.01)));
		e2 += 2.0018/abs( (i/15.) -cos((time/2.0) + 0.15*i*(uv.x) *( cos((time / 10.0) + uv.x*1.2) ) ));
		clr = clr + hsv2rgb(vec3(i/100.0-0.4,1.0,50.0*(i*0.1)))*vec3(e*2.0/4.6,1.0*e/70.0,e/40.6*1.0)*0.15
			+clamp(e2,1.9,0.4)*1.004*hsv2rgb(vec3(i/.0,1.2,50.0));	
	}
	gl_FragColor = vec4( vec3(clr.r, clr.g*0.5, abs(uv.y)*0.2+clr.b), 2.0*e);	

}