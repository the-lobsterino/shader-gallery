#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// shadertoy globals
float iTime;
vec3  iResolution;


mat2 r(float a) {
    float se=sin(a), co=cos(a);
    return mat2(se,co,co,-se);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	
	float monster = cos((time*.1+135.)*.9);
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 xy = uv*2.-1.;
    uv.x*= resolution.x/resolution.y;
    xy.x*= resolution.x/resolution.y;
	
	 gl_FragColor = vec4(1.);
	/*
	vec2 p=xy*.61356;
    vec3 c=vec3(0.);
	float b=.2135,a=3.135;
    p.x=abs(p.x);
    for (int i=0; i<22; i++) {
		float l=1.13525+cos(time*15.135)*.1355;
        float t = monster + sin(time*a)*b;
        c+=max(0.,1.-length(p))*l*.06;
        p.x=abs(p.x); p=p*1.35-vec2(.3,0.);
        p*=r(t);
		a*=0.9135;
		b*=1.135;
    }
  
   gl_FragColor = vec4(1.0); //vec4(pow(c,vec3(1.5)),1.);
*/
		
}




void main(void)
{
  
  mainImage(gl_FragColor, gl_FragCoord.xy);
	
}