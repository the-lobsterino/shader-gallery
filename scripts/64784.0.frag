/*
 * Original shader from: https://www.shadertoy.com/view/3sdSzS
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
vec3 hsv(in float h,in float s,in float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3,2,1)/3.)*6.-3.)-1.),0.,1.),s)*v;
}
void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
	vec3 px=vec3(fragCoord.xy/1.67/iResolution.y,.50)/1.;
	vec4 color=vec4(0);
    float m=1.50;
    float t=iTime*.1;
    vec2 c=vec2(sin(t),cos(t));
    float n=18.5;
    const int iter=2;
    for(int i=0;i<iter;i++)
	{
    	float id = 0.5 + 0.5*cos(iTime + sin(dot(floor(px+0.5),vec3(113.1,17.81,1.)))*43758.545);
    	vec3 co = 0.5 + 0.5*cos(iTime + 3.5*id + vec3(0.0,1.57,3.14) );
    	vec3 pa = smoothstep( 0.0, 0.2, id*(0.5 + 0.5*cos(6.2831*px)) );
    	fragColor = vec4( co*pa.x*pa.y, 1.0 );
    	//--------------
      float l=max(abs(px.x-px.z),max(abs(px.y-px.z),abs(px.z-px.x)));
      m*=smoothstep(0.,1.,l);
      px/=l*l*.2;
      px.xy=vec2(atan(c.x*c.y)*px.x-acos(c.x)*px.y,asin(c.x)*px.y-acos(c.x)*px.x);
      px.xz=vec2(atan(c.x*c.y)*px.x-acos(c.y)*px.z,asin(c.y)*px.z-acos(c.y)*px.x);
      px=abs(mod((px),n)-n/2.);
      color+=vec4(.5+.5*sin(iTime*7./8.+l),.5+.5*cos(iTime*11./8.+l),.5+.5*cos(iTime*13./8.+l),1.);
      color*=vec4(hsv(l,l,l),m);
	  //-----------------
    }
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}