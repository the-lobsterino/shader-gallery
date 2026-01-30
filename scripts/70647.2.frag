// SST
#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

#define PI 3.14159
float lines(float scaledX)
{
	float l = 0.5 + sin(scaledX*PI*2.0)*0.5;
	l = smoothstep(-0.2, 1.0, l);
	return l;
}

vec3 hsb2rgb( in vec3 c )
{
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}



void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2 st = fragCoord/iResolution.y;
	st.x-=0.5;
	st.y -= 0.25;
	
	
	//vec2 pos = st;
	vec2 uv = st;
	float iTime = time;
	

	
	
	
	// new simple outline mode
	// harcoded values for HUD :)
	float linezoom = 20.0+sin(fract(iTime*0.2)*6.28);
	float lineme = (uv.x-0.5)*linezoom;
	float zoom = 1.0;
	//uv -= offset;

	float v = smoothstep(0.3,0.5, abs(uv.y));
	v = min(v, 1.0-v);
	v = v * 1.5;		// Y fade
	float v1 =  1.0-smoothstep(0.0, 0.7, abs(uv.x));
	v1 = v1 * v1;		// X fade
	v *= v1;
	float speed = 0.355;
	//speed *= sign(uv.y);
	vec2 pos = vec2(uv*zoom*2.0);
	float l = lines(lineme);
	pos.x = abs(pos.x+(iTime*speed));
	vec3 col = hsb2rgb(vec3(fract(pos.x*1.0), 0.65, 0.9)) * l;	// outline

	float ff = 1.0;
	
	float wib = sin(time+uv.x*20.0)*.05;
	
	float y = 0.5-uv.y;

	y=y*4.0;
	

	float tt1 = mod(time,2.0);
	
	
	
	
	float tt = tt1-0.7;	//fract(time*0.5);
	float tt2 = tt1;

	//tt2 = clamp(tt2,0.0,0.7);
	float tt3 = smoothstep(0.0,0.5,tt2);
	
	
	tt2 = smoothstep(tt,1.0+tt,1.8-y-wib);
	
	ff = smoothstep(tt,1.0+tt,y+wib);
	
	
	col *= tt2 * ff * tt3;
	
	
  //float zoom = sin(iTime)*0.2;
  //zoom  = 0.5+zoom;
  //vec2 pos = vec2 (st*zoom);
  //vec2 pos = vec2 (st*1.25);
  //float l = lines(pos,.01);
  //vec3 color = hsb2rgb(vec3(iTime*0.1 + fract(pos.x), .7, .9)) * l;
  fragColor = vec4(col, 1.0);

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;	
}